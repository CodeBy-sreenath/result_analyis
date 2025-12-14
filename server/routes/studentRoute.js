import express from 'express'
import { loginStudent, logoutStudent, registerStudent } from '../controller/studentController.js'
const studentRouter=express.Router()
studentRouter.post("/register",registerStudent)
studentRouter.post("/login",loginStudent)
studentRouter.post("/logout",logoutStudent)
export default studentRouter