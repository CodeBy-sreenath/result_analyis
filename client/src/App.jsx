import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/Appcontext";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import ResultTable from "./components/ResultTable";
import { Routes, Route, Navigate } from "react-router-dom";
import PreviousResultsPage from "./pages/PreviousResultPage";

import StudentLogin from "./components/Student/StudentLogin";
import StudentHome from "./components/Student/StudentHome";
import ComplaintPage from "./components/Student/ComplaintPage";
import ViewResult from "./components/Student/ViewResult";

const App = () => {
  const { user } = useAppContext();
  const [tableData, setTableData] = useState([]);

  const isStudentRoute = window.location.pathname.startsWith("/student");

  return (
    <div className="w-screen min-h-screen">
      <Toaster />

      {/* ---------------- STUDENT AREA (NO ADMIN UI HERE) ---------------- */}
      {isStudentRoute ? (
        <Routes>
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/student/view-result" element={<ViewResult />} />
          <Route path="/student/complaint" element={<ComplaintPage />} />
          <Route path="/student/*" element={<Navigate to="/student/login" />} />
        </Routes>
      ) : (
        /* ---------------- ADMIN AREA ---------------- */
        <>
          {/* If admin logged in → show routes */}
          {user ? (
            <>
              <Navbar onDataExtracted={setTableData} />

              <Routes>
                <Route path="/" element={<ResultTable data={tableData} />} />
                <Route path="/previous-results" element={<PreviousResultsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </>
          ) : (
            /* No admin → show only admin login */
            <Routes>
              <Route
                path="*"
                element={
                  <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
                    <AdminLogin />
                  </div>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
