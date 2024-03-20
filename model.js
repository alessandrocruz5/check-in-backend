const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  tag: { type: String, required: true },
  activitiy: { type: String, required: true },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
