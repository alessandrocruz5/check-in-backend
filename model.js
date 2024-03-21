const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    hours: { type: Number, required: true },
    tag: { type: String, required: true },
    activity: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  checkIns: [{ type: mongoose.Schema.Types.ObjectId, ref: "CheckIn" }],
});

const CheckIn = mongoose.model("CheckIn", checkInSchema);

const User = mongoose.model("User", userSchema);

module.exports = CheckIn;
module.exports = User;
