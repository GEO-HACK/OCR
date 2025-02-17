"use client";

import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Extract relevant OCR fields
      const documentData = data.result.documents?.[0]?.fields || {};
      const extractedInfo = {
        Name: `${documentData.FirstName?.valueString || ""} ${documentData.LastName?.valueString || ""}`,
        "ID Number": documentData.DocumentNumber?.valueString || "N/A",
        "Date of Birth": documentData.DateOfBirth?.valueDate || "N/A",
        "Expiration Date": documentData.DateOfExpiration?.valueDate || "N/A",
      };

      setOcrResult(extractedInfo);
    } catch (err) {
      console.error(err);
      alert("Failed to process document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" onChange={handleFileChange} className="border p-2" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>

      {ocrResult && (
        <div className="p-4 border">
          <h3 className="text-lg font-bold">Extracted Information:</h3>
          {Object.entries(ocrResult).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
