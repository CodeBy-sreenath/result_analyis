import Complaint from "../model/complaint.js";

export const submitComplaint = async (req, res) => {
  try {
    const { complaint } = req.body;

    if (!complaint || complaint.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Complaint text is required",
      });
    }

    // coming from studentAuth middleware
    const { id, registerNo, name } = req.student;

    await Complaint.create({
      student: id,
      registerNo,
      studentName: name,
      complaintText: complaint,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.error("❌ Complaint submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
    });
  }
};
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("❌ Fetch complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};
