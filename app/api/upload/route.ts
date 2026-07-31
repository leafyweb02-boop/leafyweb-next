import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase service role key is required.");
  }

  return createClient(url, key);
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const maxFileSizeBytes = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  const baseName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return baseName.replace(/^-+|-+$/g, "") || "upload";
}

function getSafeStoragePath(orderId: string, fileName: string) {
  const safeOrderId = String(orderId).replace(/[^a-zA-Z0-9_-]+/g, "").slice(0, 64);
  const safeFileName = sanitizeFileName(fileName);

  if (!safeOrderId) {
    throw new Error("Invalid order id.");
  }

  return `${safeOrderId}/${Date.now()}-${safeFileName}`;
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const formData = await req.formData();

    const file = formData.get("file");
    const orderId = formData.get("orderId");

    if (!(file instanceof File) || typeof orderId !== "string" || !orderId.trim()) {
      return NextResponse.json(
        { error: "Missing file or orderId" },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, and PDF files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSizeBytes) {
      return NextResponse.json(
        { error: "File size must be 5MB or less." },
        { status: 400 }
      );
    }

    const safeFilePath = getSafeStoragePath(orderId, file.name);

    const { error: uploadError } = await supabase.storage
      .from("customer-files")
      .upload(safeFilePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("customer-files").getPublicUrl(safeFilePath);

    const { error: dbError } = await supabase.from("customer_files").insert({
      order_id: Number(orderId),
      file_name: sanitizeFileName(file.name),
      file_url: publicUrl,
      file_type: file.type,
    });

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (unknownError) {
    const error =
      unknownError instanceof Error
        ? unknownError
        : new Error("Unexpected server error");

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}