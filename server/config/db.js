import mongoose from "mongoose";
const connectDb=async()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("mongodb connected successfully")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}`)

    }
    catch(error)
    {

    }
}
export default connectDb