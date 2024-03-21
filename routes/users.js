var express = require("express");
var router = express.Router();
const User = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const record = await User.findOne({ email: req.body.email });

    if (record) {
      return res.status(400).send("User already registered");
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    await newUser.save();

    // jwt token
    const token = jwt.sign({ _id: newUser._id }, SECRET);

    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ message: "Not a valid user." });
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send({ message: "Incorrect password." });
    }

    const token = jwt.sign({ _id: user._id }, SECRET);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.send({
      message: "Logged in successfully",
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, SECRET);

    if (!claims) {
      return res.status(401).send({
        message: "Unauthenticated.",
      });
    }

    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (err) {
    return res.status(401).send({
      message: "Unauthenticated.",
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("jwt", null, { maxAge: -1 });
    res.status(200).send("Cookie deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
