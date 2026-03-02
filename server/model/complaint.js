import mongoose from "mongoose";
const complaintSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.ObjectId,
        ref:"Student",
        required:true
    },
    registerNo:{type:String,required:true,uppercase:true},
    studentName:{type:String,required:true},
    complaintText:{type:String,required:true},
    status:{
        type:String,
        enum:["Pending","Resolved"]
    }
},{timestamps:true})
const Complaint=mongoose.model("complaint",complaintSchema)
export default Complaint