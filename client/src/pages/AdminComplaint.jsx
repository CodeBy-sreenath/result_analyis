import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const res = await fetch(
        `${API_URL}/api/complaint/admin-complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch complaints");
      }

      setComplaints(data.complaints);
    } catch (err) {
      console.error("❌ Fetch complaints error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 px-6 text-white">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        Student Complaints
      </h1>

      {loading && (
        <p className="text-center text-gray-400">Loading complaints...</p>
      )}

      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {!loading && complaints.length === 0 && !error && (
        <p className="text-center text-gray-400">
          No complaints submitted yet
        </p>
      )}

      <div className="grid gap-6">
        {complaints.map((item) => (
          <div
            key={item._id}
            className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-cyan-300">
                  {item.studentName}
                </h2>
                <p className="text-sm text-gray-400">
                  Register No: {item.registerNo}
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-4 text-gray-200 whitespace-pre-wrap">
              {item.complaintText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComplaints;
