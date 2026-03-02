import express from 'express'
import studentAuth from '../middleware/studentAuth.js'
import { getAllComplaints, submitComplaint } from '../controller/complaintController.js'
import { adminMiddleware } from '../middleware/adminAuth.js'
const complaintRouter=express.Router()
complaintRouter.post("/stud-complaints",studentAuth,submitComplaint)
complaintRouter.get("/admin-complaints",adminMiddleware,getAllComplaints)
export default complaintRouter