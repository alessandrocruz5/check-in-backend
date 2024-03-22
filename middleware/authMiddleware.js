const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

// module.exports = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET); // Use your actual secret key here
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
