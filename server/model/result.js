import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String },
  grade: { type: String, required: true },
  credits: { type: Number, default: 3 }
});

const resultSchema = new mongoose.Schema({
  registerNo: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  subjects: [subjectSchema],
  failedSubjects: [String],
  passedSubjects: [String],
  totalFailed: { type: Number, default: 0 },
  totalPassed: { type: Number, default: 0 },
  status: { type: String, enum: ['Pass', 'Fail'], required: true },
  sgpa: { type: Number },
  department: { type: String, required: true },
  examName: { type: String },
  examDate: { type: String }
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;