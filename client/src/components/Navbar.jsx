import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage("❌ Only PDF or Excel (.xls, .xlsx) files are allowed!");
      return;
    }

    alert("File is valid: " + selectedFile.name);
  };

  return (
    <>
      <nav
        className="
          fixed top-0 left-0 w-full h-20
          bg-black/70 backdrop-blur-md 
          text-white px-4 py-3 
          flex justify-between items-center 
          z-50
        "
      >
        {/* LEFT SECTION (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/home" className="hover:text-cyan-300 transition">Home</a>
          <a href="/results" className="hover:text-cyan-300 transition">Previous Results</a>
          <a href="/complaints" className="hover:text-cyan-300 transition">Complaints</a>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="text-3xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf, .xls, .xlsx"
            className="
              text-white text-sm 
              file:bg-cyan-600 file:text-white 
              file:px-3 file:py-1 
              file:border-none file:rounded-lg 
              file:hover:bg-cyan-700 cursor-pointer
            "
          />

          {selectedFile && (
            <button
              onClick={handleSubmit}
              className="
                bg-green-600 hover:bg-green-700 
                px-4 py-2 rounded-lg 
                font-semibold transition
              "
            >
              Submit
            </button>
          )}

          <button
            className="
              bg-red-600 hover:bg-red-700 
              px-4 py-2 rounded-lg 
              font-semibold transition
            "
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (Dropdown) */}
      {menuOpen && (
        <div
          className="
            fixed top-20 left-0 w-full 
            bg-black/80 backdrop-blur-md text-white 
            flex flex-col items-center gap-6 
            py-6 z-40 md:hidden
          "
        >
          <a href="/home" className="text-lg hover:text-cyan-300">Home</a>
          <a href="/results" className="text-lg hover:text-cyan-300">Previous Results</a>
          <a href="/complaints" className="text-lg hover:text-cyan-300">Complaints</a>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="absolute right-6 top-28 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Navbar;
