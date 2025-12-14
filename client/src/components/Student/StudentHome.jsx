import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";


const StudentHome = () => {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    // Fetch stored student name from localStorage
    const name = localStorage.getItem("studentName");
    if (name) setStudentName(name);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <StudentNavbar />

      <div className="pt-32 text-center">
        <h1 className="text-4xl font-bold text-cyan-400">
          Welcome {studentName || "Student"}
        </h1>

        <p className="text-gray-300 mt-3 text-lg">
          Choose an option from the menu to continue.
        </p>
      </div>
    </div>
  );
};

export default StudentHome;
