import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";

const ViewResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        if (!token) {
          window.location.href = "/student/login";
          return;
        }

       /* const response = await fetch(
          "http://localhost:3000/api/studresult/view-result",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );*/
        const response = await fetch(
  `${import.meta.env.VITE_SERVER_URL}/api/studresult/view-result`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load result");
        }

        setResult(data.result);
      } catch (error) {
        console.error("❌ Error fetching result:", error);
        alert("Unable to fetch student result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <>
        <StudentNavbar />
        <div className="pt-32 text-center text-gray-300 text-xl">
          Loading result...
        </div>
      </>
    );
  }

  // ❌ NO RESULT SAFETY
  if (!result) {
    return (
      <>
        <StudentNavbar />
        <div className="pt-32 text-center text-red-400 text-xl">
          Result not available
        </div>
      </>
    );
  }

  return (
    <>
      <StudentNavbar />

      <div className="pt-32 flex justify-center px-4">
        <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-700 shadow-xl">

          <h2 className="text-3xl font-bold text-cyan-400 text-center">
            Grade Card
          </h2>

          <p className="text-center text-gray-300 mt-2">
            Register Number: <span className="text-white">{result.registerNo}</span>
          </p>

          <p className="text-center text-gray-400">
            Semester {result.semester} | {result.examName}
          </p>

          {/* SUBJECT TABLE */}
          <div className="mt-8">
            <table className="w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-cyan-300">
                  <th className="p-3 border border-gray-700">Subject Code</th>
                  <th className="p-3 border border-gray-700">Grade</th>
                </tr>
              </thead>

              <tbody>
                {result.subjects?.length > 0 ? (
                  result.subjects.map((sub, idx) => (
                    <tr key={idx} className="bg-gray-900 text-white">
                      <td className="p-3 border border-gray-700">{sub.code}</td>
                      <td className="p-3 border border-gray-700 text-center">
                        {sub.grade}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="p-4 text-center text-gray-400 border border-gray-700"
                    >
                      No subjects available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* SGPA & STATUS */}
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-green-400">
                SGPA:{" "}
                {typeof result.sgpa === "number"
                  ? result.sgpa.toFixed(2)
                  : result.sgpa
                  ? Number(result.sgpa).toFixed(2)
                  : "Not Available"}
              </h2>

              <p
                className={`mt-2 font-semibold ${
                  result.status === "Pass"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                Status: {result.status || "N/A"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewResult;
