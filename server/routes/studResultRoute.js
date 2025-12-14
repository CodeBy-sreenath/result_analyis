import express from 'express'
import studentAuth from '../middleware/studentAuth.js'
import { getStudentResult } from '../controller/studentResultController.js'
const studResultRouter=express.Router()
studResultRouter.get("/view-result",studentAuth,getStudentResult)
export default studResultRouter