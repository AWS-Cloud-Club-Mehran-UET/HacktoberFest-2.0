import { useState } from "react";
import { exportData } from "../services/api";

export default function ExportModal({ isOpen, onClose }) {
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await exportData(format);
      // In a real app, this would download a file
      alert(
        `Your data has been prepared for download in ${format.toUpperCase()} format!`
      );
      onClose();
    } catch (error) {
      alert("Error exporting data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Export Financial Data</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat("csv")}
                className={`p-3 border-2 rounded-lg text-center ${
                  format === "csv"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                📊 CSV
              </button>
              <button
                onClick={() => setFormat("pdf")}
                className={`p-3 border-2 rounded-lg text-center ${
                  format === "pdf"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                📄 PDF Report
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              What's included:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All transactions with categories</li>
              <li>• Budget progress and limits</li>
              <li>• Savings goals and progress</li>
              <li>• Achievement history</li>
              <li>• Financial summaries</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Exporting..." : `Export as ${format.toUpperCase()}`}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
