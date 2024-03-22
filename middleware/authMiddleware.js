const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
