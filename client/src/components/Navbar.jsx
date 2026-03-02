import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";   // ✅ IMPORTANT FIX

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Navbar = ({ onDataExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrorMessage("");
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("❌ Only PDF files are allowed!");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setLoading(true);
    toast.loading("Uploading & processing PDF...", { id: "extract" });

    try {
      const base64Data = await fileToBase64(selectedFile);

      const response = await axios.post(`${API_URL}/api/results/upload`, {
        fileData: base64Data,
        mimeType: selectedFile.type,
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: "extract" });

        onDataExtracted(response.data.students);

        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to process PDF", {
        id: "extract",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
  // Remove admin token
  localStorage.removeItem("adminToken");

  // Clear extracted table data (optional)
  if (onDataExtracted) {
    onDataExtracted([]);
  }

  // Redirect to ADMIN LOGIN page
  window.location.replace("/");
};


  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-20 bg-black/70 backdrop-blur-md text-white px-4 py-3 flex justify-between items-center z-50">

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
          <Link to="/previous-results" className="hover:text-cyan-300 transition">Previous Results</Link>
          <Link to="/complaints" className="hover:text-cyan-300 transition">Complaints</Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-3xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Upload + Logout */}
        <div className="flex items-center gap-4">

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="
              text-white text-sm
              file:bg-cyan-600 file:text-white
              file:px-3 file:py-1
              file:border-none file:rounded-lg
              file:hover:bg-cyan-700 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {selectedFile && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                bg-green-600 hover:bg-green-700 
                px-4 py-2 rounded-lg 
                font-semibold transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          )}

          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition">
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-20 left-0 w-full bg-black/80 backdrop-blur-md text-white flex flex-col items-center gap-6 py-6 z-40 md:hidden">
          <Link to="/" className="text-lg hover:text-cyan-300">Home</Link>
          <Link to="/previous-results" className="text-lg hover:text-cyan-300">Previous Results</Link>
          <Link to="/complaints" className="text-lg hover:text-cyan-300">Complaints</Link>
        </div>
      )}

      {/* PDF Error */}
      {errorMessage && (
        <div className="fixed right-6 top-28 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-[70]">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Navbar;
