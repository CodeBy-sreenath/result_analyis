import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ----------------------
// ADMIN LOGIN
// ----------------------
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Create token
    const token = jwt.sign(
      { username: process.env.ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token, // <-- IMPORTANT
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------
// GET ADMIN DETAILS (/me)
// ----------------------
export const adminMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      admin: req.admin, // Data from decoded token
    });
  } catch (error) {
    console.error("Me route error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
