import jwt from 'jsonwebtoken'
const studentAuth=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader)
    {
         return res.status(401).json({ message: "No token provided" });
    }
      const token = authHeader.split(" ")[1];
      try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded; // { id, registerNo }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
export default studentAuth