import express from 'express'
import  'dotenv/config'
import cors from 'cors'
import connectDb from './config/db.js'
import adminRouter from './adminRoute.js'
import router from './routes/resultRoutes.js'
import studentRouter from './routes/studentRoute.js'
import studResultRouter from './routes/studResultRoute.js'
import complaintRouter from './routes/complaintRoute.js'
const app=express()
await connectDb()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>res.send("server is live"))
app.use('/api/admin',adminRouter)
app.use('/api/results',router)
app.use('/api/student',studentRouter)
app.use('/api/studresult',studResultRouter)
app.use('/api/complaint',complaintRouter)
const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);


