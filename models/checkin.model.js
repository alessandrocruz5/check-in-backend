const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    hours: { type: Number, required: true },
    tag: { type: String, required: true },
    activity: { type: String, required: true },
    userName: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

checkInSchema.pre("save", async function (next) {
  try {
    const user = await mongoose.model("User").findById(this.user);
    if (user) {
      this.userName = user.name;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const CheckIn = mongoose.model("CheckIn", checkInSchema);
module.exports = CheckIn;
