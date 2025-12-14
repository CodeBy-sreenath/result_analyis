import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const UploadPage = () => {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPDF = () => {
    if (!pdf) return alert("Please choose a PDF");

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

      try {
        await axios.post(`${API_URL}/upload`, {
          fileData: base64,
          mimeType: "application/pdf",
        });

        alert("Upload successful!");
        window.location.href = "/results";

      } catch (err) {
        console.error(err);
        alert("Upload failed");
      }

      setLoading(false);
    };

    reader.readAsDataURL(pdf);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4 font-bold">Upload KTU Result PDF</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={uploadPDF}
        className="px-6 py-2 bg-cyan-600 rounded-lg"
      >
        {loading ? "Processing..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadPage;
