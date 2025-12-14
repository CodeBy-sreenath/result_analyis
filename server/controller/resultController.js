//import Result from "../model/Result.js";
import Result from "../model/result.js";
import { extractTextFromPDF } from "../services/pdfParser.js";
import { extractDataFromPDFText } from "../services/geminiService.js";
import { processExtractedData } from "../utils/resultProcessor.js";


// ======================================================
// 📌 UPLOAD + PROCESS PDF
// ======================================================
export const uploadAndProcessPDF = async (req, res) => {
  try {
    console.log("\n==============================");
    console.log("📨 NEW PDF UPLOAD RECEIVED");
    console.log("==============================\n");

    const { fileData, mimeType } = req.body;

    if (!fileData || !mimeType) {
      return res.status(400).json({
        error: "File data and MIME type are required",
      });
    }

    console.log(`✅ File received. MIME: ${mimeType}`);

    // ------------------------------------------------------
    // STEP 1 → Extract Text From PDF
    // ------------------------------------------------------
    console.log("\n🚀 STEP 1: Extracting text from PDF...");
    const pdfText = await extractTextFromPDF(fileData);


    // ------------------------------------------------------
    // STEP 2 → Send text to Gemini API for extraction
    // ------------------------------------------------------
    console.log("\n🚀 STEP 2: Extracting structured data using Gemini...");
    const extractedData = await extractDataFromPDFText(pdfText);

    if (
      !extractedData.departments ||
      extractedData.departments.length === 0
    ) {
      return res.status(400).json({
        error: "No student data found. Gemini returned empty departments.",
      });
    }

    console.log("✅ Gemini returned valid structured data");


    // ------------------------------------------------------
    // STEP 3 → Convert extracted data into DB-ready format
    // ------------------------------------------------------
    console.log("\n🚀 STEP 3: Processing extracted data...");
    const processedData = processExtractedData(extractedData);

    console.log(`✅ Processed ${processedData.length} students`);


    // ------------------------------------------------------
    // STEP 4 → Save to MongoDB using Bulk Write
    // ------------------------------------------------------
    console.log("\n🚀 STEP 4: Saving results to database...");

    const bulkOps = processedData.map((student) => ({
      updateOne: {
        filter: { registerNo: student.registerNo },
        update: { $set: student },
        upsert: true,
      },
    }));

    const dbResult = await Result.bulkWrite(bulkOps);

    console.log("✅ Database update complete");


    // ------------------------------------------------------
    // FINAL RESPONSE
    // ------------------------------------------------------
    return res.status(200).json({
      success: true,
      message: `Successfully processed ${processedData.length} students`,
      savedRecords: {
        inserted: dbResult.upsertedCount,
        updated: dbResult.modifiedCount,
      },
      students: processedData,
    });

  } catch (error) {
    console.error("\n❌ ERROR PROCESSING PDF:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Internal server error while processing PDF",
    });
  }
};



// ======================================================
// 📌 GET ALL RESULTS
// ======================================================
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ registerNo: 1 });
    res.status(200).json(results);

  } catch (err) {
    console.error("❌ Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};



// ======================================================
// 📌 GET RESULTS BY DEPARTMENT
// ======================================================
export const getResultsByDepartment = async (req, res) => {
  try {
    const results = await Result.find({
      department: req.params.dept.toUpperCase(),
    }).sort({ registerNo: 1 });

    res.status(200).json(results);

  } catch (err) {
    console.error("❌ Error fetching department results:", err);
    res.status(500).json({ error: "Failed to fetch department results" });
  }
};



// ======================================================
// 📌 GET RESULT BY REGISTER NUMBER
// ======================================================
export const getResultByRegisterNumber = async (req, res) => {
  try {
    const result = await Result.findOne({
      registerNo: req.params.registerNo.toUpperCase(),
    });

    if (!result) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(result);

  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ error: "Failed to fetch student result" });
  }
};



// ======================================================
// 📌 STATISTICS (Pass, Fail, Count)
// ======================================================
export const getStatistics = async (req, res) => {
  try {
    const total = await Result.countDocuments();
    const passed = await Result.countDocuments({ status: "Pass" });
    const failed = await Result.countDocuments({ status: "Fail" });

    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalStudents: total,
      passedStudents: passed,
      failedStudents: failed,
      passPercentage,
    });

  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};
