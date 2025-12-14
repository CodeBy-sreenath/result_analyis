import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";
//import StudentNavbar from "../components/StudentNavbar";

const ComplaintPage = () => {
  const [complaint, setComplaint] = useState("");

  const submitComplaint = () => {
    // For now, only frontend
    alert("Complaint submitted (frontend only). Backend not connected yet.");
    setComplaint("");
  };

  return (
    <>
      <StudentNavbar />

      <div className="pt-32 flex justify-center">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-700 w-full max-w-lg text-white">

          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
            Submit Complaint
          </h2>

          <textarea
            rows="6"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            className="w-full p-3 bg-black/50 rounded-md border border-gray-600 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Describe the issue with your result..."
          ></textarea>

          <button
            onClick={submitComplaint}
            className="w-full mt-6 bg-cyan-500 py-3 rounded-lg hover:bg-cyan-600 transition font-semibold"
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </>
  );
};

export default ComplaintPage;
