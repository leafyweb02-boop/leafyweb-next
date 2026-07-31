"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Props {
  orderId: string;
}

interface FileRecord {
  id: number;
  order_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
}

export default function FileGallery({ orderId }: Props) {
  const [files, setFiles] = useState<FileRecord[]>([]);

  const loadFiles = useCallback(async () => {
    const { data, error } = await supabase
      .from("customer_files")
      .select("*")
      .eq("order_id", Number(orderId))
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setFiles(data || []);
  }, [orderId]);

  useEffect(() => {
    async function fetchFiles() {
      await loadFiles();
    }

    void fetchFiles();
  }, [loadFiles]);

  async function deleteFile(file: FileRecord) {
    const ok = confirm("Delete this file?");

    if (!ok) return;

    const path = file.file_url.split("/customer-files/")[1];

    await supabase.storage
      .from("customer-files")
      .remove([path]);

    await supabase
      .from("customer_files")
      .delete()
      .eq("id", file.id);

    loadFiles();
  }

  return (
    <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">

      <h2 className="text-3xl font-bold mb-6">
        Customer Files
      </h2>

      {files.length === 0 && (
        <p className="text-gray-400">
          No files uploaded.
        </p>
      )}

      <div className="grid grid-cols-4 gap-5">

        {files.map((file) => (

          <div
            key={file.id}
            className="bg-[#111] rounded-2xl p-4"
          >

            {file.file_type.startsWith("image") ? (

              <Image
                src={file.file_url}
                width={320}
                height={240}
                alt={file.file_name}
                className="rounded-xl h-40 w-full object-cover"
              />

            ) : (

              <div className="h-40 flex items-center justify-center text-6xl">
                📄
              </div>

            )}

            <p className="mt-3 text-sm break-all">
              {file.file_name}
            </p>

            <div className="flex gap-2 mt-4">

              <a
                href={file.file_url}
                target="_blank"
                className="bg-blue-600 px-3 py-2 rounded-lg"
              >
                View
              </a>

              <button
                onClick={() => deleteFile(file)}
                className="bg-red-600 px-3 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}