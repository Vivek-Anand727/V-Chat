import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuth = (req, res, next) => {
    try {
      const token = req.cookies.token;
        
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
  

export default isAuth;
