import React from "react";
import { useAppContext } from "../context/Appcontext";
import { useState } from "react";

const AdminLogin = () => {
  const{loginAdmin}=useAppContext()
  const[username,setUserName]=useState('')
  const[password,setPassWord]=useState('')
  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(!username || !password)
    {
      alert("please fill details")
      return
    }
    await loginAdmin(username,password)

  }
  return (
    <div className="
    h-screen md:min-h-screen w-screen 
    bg-no-repeat 
    bg-top md:bg-center
    bg-cover 
    flex items-center justify-center p-4
  "
      style={{
        backgroundImage:
          "url('https://nmd.chintvm.edu.in/wp-content/uploads/2023/06/FINAL-RESULT-ANALYSIS-X-XII.jpg')",
      }}>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

        
        <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-center text-gray-200 mb-8 text-sm">
          Please enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
            value={password}
            onChange={(e)=>setPassWord(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          © 2025 KTU Result Analysis Dashboard
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
