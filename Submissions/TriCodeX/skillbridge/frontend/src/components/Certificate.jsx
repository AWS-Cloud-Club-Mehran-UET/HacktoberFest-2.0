import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Certificate({ enrollmentId, onClose }) {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCertificate = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/certificate/${enrollmentId}`);
      setCertificate(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error generating certificate");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    // In a real app, this would generate a PDF
    alert("Certificate download functionality would be implemented here!");
    // This would typically generate a PDF using libraries like jsPDF
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Course Certificate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!certificate ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Generate your course completion certificate
            </p>
            <button
              onClick={generateCertificate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Certificate"}
            </button>
          </div>
        ) : (
          <div className="border-2 border-gold-500 p-8 text-center bg-gradient-to-b from-blue-50 to-white">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-blue-800 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-gray-600">This is to certify that</p>
            </div>

            <div className="my-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {certificate.studentName}
              </h2>
              <p className="text-gray-600">
                has successfully completed the course
              </p>
            </div>

            <div className="my-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                {certificate.courseTitle}
              </h3>
              <p className="text-gray-600">
                taught by {certificate.instructor}
              </p>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-300">
              <div className="text-left">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{certificate.completionDate}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-mono text-sm">{certificate.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{certificate.duration}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={downloadCertificate}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
