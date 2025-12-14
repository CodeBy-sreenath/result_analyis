import { Children, createContext, useContext, useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Appcontext=createContext()
export const AppContextProvider=({children})=>{
const navigate=useNavigate()
const[user,setUser]=useState(null)
const[token,setToken]=useState(localStorage.getItem('token')||'')
const[student,setStudent]=useState(null)
axios.defaults.baseURL=import.meta.env.VITE_SERVER_URL
const loginAdmin = async (username, password) => {
  try {
    const res = await axios.post('/api/admin/login', { username, password });

    const data = res.data; // <-- Axios returns data directly

    if (!data.success) {
      toast.error(data.message || "Login failed");
      return false;
    }

    // Store token
    localStorage.setItem("adminToken", data.token);

    // Set user (decode token if needed)
    setUser({ username }); // or store more info if you have

    toast.success("Login successful");

    navigate('/'); // redirect to home page

    return true;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong");
    return false;
  }
};



   
    const value={user,setUser,navigate,loginAdmin,student,setStudent}
    return(
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}
export const useAppContext=()=>{
    return useContext(Appcontext)
}