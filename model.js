const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    hours: { type: Number, required: true },
    tag: { type: String, required: true },
    activity: { type: String, required: true },
  },
  { timestamps: true }
);

const CheckIn = mongoose.model("CheckIn", checkInSchema);

module.exports = CheckIn;
