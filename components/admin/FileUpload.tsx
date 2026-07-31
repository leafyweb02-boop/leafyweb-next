"use client";

import { useState } from "react";

interface Props {
  orderId: string;
  onUploaded?: () => void;
}

export default function FileUpload({
  orderId,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function uploadFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderId", orderId);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      console.error(result);
      alert(result.error);
      setUploading(false);
      return;
    }

    console.log(result);

    setUploading(false);

    alert("File uploaded successfully!");

    if (onUploaded) {
      onUploaded();
    }
  }

  return (
    <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">
        Upload Files
      </h2>

      <input
        type="file"
        onChange={uploadFile}
        className="block w-full text-sm"
      />

      {uploading && (
        <div className="mt-5">
          Uploading...
        </div>
      )}
    </div>
  );
}