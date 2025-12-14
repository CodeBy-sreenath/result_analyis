import express from 'express';
import { 
  uploadAndProcessPDF,
  getAllResults,
  getResultsByDepartment,
  getResultByRegisterNumber,
  getStatistics
} from '../controller/resultController.js';

const router = express.Router();

// 1️⃣ Upload PDF
router.post('/upload', uploadAndProcessPDF);

// 2️⃣ Get all results
router.get('/', getAllResults);

// 3️⃣ Get statistics  (PLACE BEFORE registerNo route!)
router.get('/stats/summary', getStatistics);

// 4️⃣ Get results by department
router.get('/department/:dept', getResultsByDepartment);

// 5️⃣ Get result by register number (keep LAST)
router.get('/:registerNo', getResultByRegisterNumber);

export default router;
