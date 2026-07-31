import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const maxFileSizeBytes = 5 * 1024 * 1024;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase service role key is required.");
  }

  return createClient(url, key);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeFileName(fileName: string) {
  const baseName = fileName
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-");

  return baseName.replace(/^-+|-+$/g, "") || "upload";
}

function getPublicFileName(fileName: string) {
  return `${Date.now()}-${sanitizeFileName(fileName)}`;
}

async function uploadFileToCustomerFiles(
  supabase: ReturnType<typeof getSupabaseClient>,
  file: File,
  path: string
) {
  const { error: uploadError } = await supabase.storage
    .from("customer-files")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("customer-files").getPublicUrl(path);

  return publicUrl;
}

async function insertCustomerFileRecord(
  supabase: ReturnType<typeof getSupabaseClient>,
  orderId: number,
  file: { fileName: string; fileUrl: string; fileType: string }
) {
  const { error } = await supabase.from("customer_files").insert({
    order_id: orderId,
    file_name: sanitizeFileName(file.fileName),
    file_url: file.fileUrl,
    file_type: file.fileType,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const supabase = getSupabaseClient();

    const requiredFields = [
      "business_name",
      "contact_person",
      "whatsapp",
      "email",
      "business_type",
      "template",
      "business_address",
    ] as const;

    const formValues: Record<string, string> = {};
    let logoUrl = "";
    let imageUrls: string[] = [];
    let logoFile: File | null = null;
    let imageFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formPayload = await req.formData();

      requiredFields.forEach((field) => {
        const value = formPayload.get(field);
        if (typeof value === "string") {
          formValues[field] = value;
        }
      });

      const logoField = formPayload.get("logo");
      if (logoField instanceof File) {
        logoFile = logoField;
      }

      const uploadedImages = formPayload.getAll("images");
      imageFiles = uploadedImages.filter(
        (file): file is File => file instanceof File
      );
    } else {
      const body = await req.json();
      const formData = body?.formData;
      logoUrl = body?.logoUrl || "";
      imageUrls = Array.isArray(body?.imageUrls) ? body.imageUrls : [];

      if (!formData || typeof formData !== "object") {
        return NextResponse.json(
          { error: "Invalid order payload." },
          { status: 400 }
        );
      }

      requiredFields.forEach((field) => {
        if (typeof formData[field] === "string") {
          formValues[field] = formData[field];
        }
      });
    }

    for (const field of requiredFields) {
      if (!isNonEmptyString(formValues[field])) {
        return NextResponse.json(
          { error: `The ${field.replace(/_/g, " ")} field is required.` },
          { status: 400 }
        );
      }
    }

    if (!isValidEmail(formValues.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (contentType.includes("multipart/form-data")) {
      if (logoFile) {
        if (!allowedMimeTypes.has(logoFile.type)) {
          return NextResponse.json(
            {
              error: "Only JPG, PNG, and WebP files are allowed for the logo.",
            },
            { status: 400 }
          );
        }

        if (logoFile.size > maxFileSizeBytes) {
          return NextResponse.json(
            {
              error: "The logo file must be 5MB or less.",
            },
            { status: 400 }
          );
        }

        const logoStoragePath = `orders/${getPublicFileName(logoFile.name)}`;
        logoUrl = await uploadFileToCustomerFiles(
          supabase,
          logoFile,
          logoStoragePath
        );
      }

      for (const imageFile of imageFiles) {
        if (!allowedMimeTypes.has(imageFile.type)) {
          return NextResponse.json(
            {
              error: "Only JPG, PNG, and WebP files are allowed for the gallery images.",
            },
            { status: 400 }
          );
        }

        if (imageFile.size > maxFileSizeBytes) {
          return NextResponse.json(
            {
              error: "Each uploaded gallery image must be 5MB or less.",
            },
            { status: 400 }
          );
        }

        const imageStoragePath = `orders/${getPublicFileName(imageFile.name)}`;
        const imageUrl = await uploadFileToCustomerFiles(
          supabase,
          imageFile,
          imageStoragePath
        );

        imageUrls.push(imageUrl);
      }
    }

    if (typeof logoUrl !== "string") {
      return NextResponse.json(
        { error: "The uploaded logo URL is invalid." },
        { status: 400 }
      );
    }

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "The uploaded image URLs are invalid." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...formValues,
          logo_url: logoUrl || "",
          image_urls: imageUrls || [],
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Order could not be created." },
        { status: 500 }
      );
    }

    if (contentType.includes("multipart/form-data")) {
      const uploadedFiles = [
        ...(logoFile
          ? [
              {
                fileName: logoFile.name,
                fileUrl: logoUrl,
                fileType: logoFile.type,
              },
            ]
          : []),
        ...imageFiles.map((file) => ({
          fileName: file.name,
          fileUrl: imageUrls[imageUrls.length - imageFiles.length + imageFiles.indexOf(file)],
          fileType: file.type,
        })),
      ];

      for (const fileRecord of uploadedFiles) {
        try {
          await insertCustomerFileRecord(
            supabase,
            Number(data.id),
            fileRecord
          );
        } catch (recordError) {
          console.error("Customer file record insert failed:", recordError);
        }
      }
    }

    return NextResponse.json({ success: true, order: data });
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
