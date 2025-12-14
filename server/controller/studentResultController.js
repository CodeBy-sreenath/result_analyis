import Result from "../model/result.js"

export const getStudentResult = async (req, res) => {
  try {
    const registerNo = req.student.registerNo.toUpperCase();

    const result = await Result.findOne({ registerNo });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    console.log("📊 SGPA FROM DB:", result.sgpa); // 👈 DEBUG

    res.status(200).json({
      success: true,
      result: {
        registerNo: result.registerNo,
        semester: result.semester,
        examName: result.examName,
        subjects: result.subjects,
        sgpa: result.sgpa,          // ✅ EXPLICIT
        status: result.status,
      },
    });
  } catch (error) {
    console.error("❌ Student result error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student result",
    });
  }
};
