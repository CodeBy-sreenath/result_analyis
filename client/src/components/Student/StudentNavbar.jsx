import React from "react";
import { Link, useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem("studentToken");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentRegisterNo");

    // ✅ Redirect to student login
    navigate("/student/login", { replace: true })
   
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md h-20 px-6 flex items-center justify-between text-white z-50">
      <h2 className="text-2xl font-bold text-cyan-400">Student Portal</h2>

      <div className="flex gap-8 text-lg">
        <Link to="/student/view-result" className="hover:text-cyan-300 transition">
          View Result
        </Link>

        <Link to="/student/complaint" className="hover:text-cyan-300 transition">
          Complaint
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
