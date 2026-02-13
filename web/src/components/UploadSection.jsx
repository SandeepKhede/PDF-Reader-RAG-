import { useState } from "react";
import { uploadPDF } from "../api/upload";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await uploadPDF(file);
      setMessage(`Stored ${res.chunksStored} chunks`);
    } catch {
      setMessage("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Upload PDF</h2>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="application/pdf"
          className="border p-2 rounded"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
