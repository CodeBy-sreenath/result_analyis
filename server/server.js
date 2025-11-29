import express from 'express'
import  'dotenv/config'
import cors from 'cors'
import connectDb from './config/db.js'
import adminRouter from './adminRoute.js'
const app=express()
await connectDb()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>res.send("server is live"))
app.use('/api/admin',adminRouter)
const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})


