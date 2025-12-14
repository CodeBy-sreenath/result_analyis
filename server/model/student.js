import mongoose from 'mongoose'
const studentSchema=new mongoose.Schema({
    name:{type:String,required:true},
    registerNo:{type:String,required:true,unique:true,uppercase:true,trim:true},
    password:{type:String,required:true},


},{timestamps:true})
const Student=mongoose.model('Student',studentSchema)
export default Student