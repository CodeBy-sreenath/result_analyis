import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
const API_URL=import.meta.env.VITE_SERVER_URL

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    registerNo: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try
    {
      if(isLogin)
      {
        const res=await axios.post(`${API_URL}/api/student/login`,{
          registerNo:form.registerNo,
          password:form.password
        })
        if(res.data.success)
        {
          localStorage.setItem("studentToken",res.data.token)
          localStorage.setItem("studentName",res.data.student.name)
             localStorage.setItem(
          "studentRegisterNo",
          res.data.student.registerNo
        );
        navigate("/student/home")

        }
      }
      else
      {
        const res=await axios.post(`${API_URL}/api/student/register`,{
          name:form.name,
          registerNo:form.registerNo,
          password:form.password
        })
        if(res.data.success)
        {
           localStorage.setItem("studentToken", res.data.token);
          localStorage.setItem("studentName", res.data.student.name);
          localStorage.setItem(
            "studentRegisterNo",
            res.data.student.registerNo
          );

          navigate("/student/home");
        }
      }

    }
    catch(error)
    {
       alert(error.response?.data?.message || "Authentication failed");

    }

   

    // After clicking login/register → go to student home page
    //navigate("/student/home");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://heloix.com/images/products/result-wizard-result-management-system.png')",
      }}
    >
      <div className="backdrop-blur-xl bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        
        {/* Toggle Buttons */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-lg font-semibold rounded-l-xl transition 
              ${!isLogin ? "bg-cyan-500 text-white" : "bg-white/20 text-gray-300"}`}
          >
            Register
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-lg font-semibold rounded-r-xl transition 
              ${isLogin ? "bg-cyan-500 text-white" : "bg-white/20 text-gray-300"}`}
          >
            Login
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white text-center">
          {isLogin ? "Student Login" : "Student Registration"}
        </h2>

        <p className="text-center text-gray-300 mb-6">
          {isLogin ? "Access your result" : "Create your student account"}
        </p>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Registration Name */}
          {!isLogin && (
            <div>
              <label className="text-gray-200 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-black/40 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                placeholder="Enter your name"
              />
            </div>
          )}

          {/* Register Number */}
          <div>
            <label className="text-gray-200 font-medium">Register Number</label>
            <input
              type="text"
              name="registerNo"
              value={form.registerNo}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
              placeholder="Ex: TVE21CS045"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-200 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-black/40 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 transition rounded-md text-white font-semibold shadow-lg"
          >
            {isLogin ? "Login" : "Register"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
