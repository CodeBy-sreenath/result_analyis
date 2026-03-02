import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";

const ComplaintPage = () => {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    try {
      const token = localStorage.getItem("studentToken");

      if (!token) {
        window.location.href = "/student/login";
        return;
      }

      setLoading(true);

      /*const response = await fetch(
        "http://localhost:3000/api/complaint/stud-complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ complaint }),
        }
      );*/
      const response = await fetch(
  `${import.meta.env.VITE_SERVER_URL}/api/complaint/stud-complaints`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ complaint }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint");
      }

      alert("✅ Complaint submitted successfully");
      setComplaint("");
    } catch (error) {
      console.error("❌ Complaint error:", error);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 py-3 rounded-lg hover:bg-cyan-600 transition font-semibold disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ComplaintPage;
