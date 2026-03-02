import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../model/student.js";

/* =======================
   REGISTER STUDENT
======================= */
export const registerStudent = async (req, res) => {
  try {
    const { name, registerNo, password } = req.body;

    if (!name || !registerNo || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({
      registerNo: registerNo.toUpperCase(),
    });

    if (existingStudent) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      registerNo: registerNo.toUpperCase(),
      password: hashedPassword,
    });

    // ✅ FIX: include registerNo in token
    const token = jwt.sign(
      {
        id: student._id,
        name:student.name,
        registerNo: student.registerNo, // 🔥 REQUIRED
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        registerNo: student.registerNo,
      },
    });
  } catch (error) {
    console.error("Student Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   LOGIN STUDENT
======================= */
export const loginStudent = async (req, res) => {
  try {
    const { registerNo, password } = req.body;

    if (!registerNo || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findOne({
      registerNo: registerNo.toUpperCase(),
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, student.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ FIX: include registerNo in token
    const token = jwt.sign(
      {
        id: student._id,
        name:student.name,
        registerNo: student.registerNo, // 🔥 REQUIRED
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        registerNo: student.registerNo,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   LOGOUT STUDENT
======================= */
export const logoutStudent = async (req, res) => {
  try {
    // JWT logout is handled on frontend
    return res.status(200).json({
      success: true,
      message: "Student logged out successfully",
    });
  } catch (error) {
    console.error("Student Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
