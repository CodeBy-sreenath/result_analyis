import express from 'express'
import { adminMiddleware } from './middleware/adminAuth.js'
import { adminLogin,adminMe } from './controller/adminController.js'
const adminRouter=express.Router()
adminRouter.post("/login",adminLogin)
adminRouter.get("/me", adminMiddleware, adminMe);
export default adminRouter