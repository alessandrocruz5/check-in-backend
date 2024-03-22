var express = require("express");
var router = express.Router();
const CheckIn = require("../models/checkin.model");
const User = require("../models/user.model");
const authMiddleware = require("../middleware/authMiddleware");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

var app = express();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/forms", async (req, res) => {
  try {
    const forms = await CheckIn.find({});
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/check-ins", async (req, res) => {
  try {
    const user = await User.find(user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user.checkIns);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
});

router.get("/check-ins", authMiddleware, async (req, res) => {
  try {
    const user = await User.find(req.userId);
    console.log(user);
    const checkIns = await CheckIn.find({ user: req.userId });
    console.log(checkIns);
    res.status(200).send(checkIns);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.post("/newCheckIn", authMiddleware, async (req, res) => {
  const checkIn = new CheckIn({
    activity: req.body.activity,
    hours: req.body.hours,
    tag: req.body.tag,
    user: req.user,
  });

  try {
    const newCheckIn = await checkIn.save();

    await User.findByIdAndUpdate(req.user, {
      $push: { checkIns: newCheckIn._id },
    });
    res.status(201).json(newCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/check-ins/:id", async (req, res) => {
  const checkInId = req.params.id;

  try {
    const deletedCheckIn = await CheckIn.findByIdAndDelete(checkInId);

    if (!deletedCheckIn) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    res.status(200).json({ message: "Check-in deleted" });
  } catch (err) {
    console.error("Error");
  }
});

module.exports = router;
