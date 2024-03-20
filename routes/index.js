var express = require("express");
var router = express.Router();
const Form = require("../model");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find({});
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/form/:id", getFormById);

router.post("/newForm", async (req, res) => {
  console.log(req.body);
  const form = new Form(req.body);

  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/form/:id", deleteForm);

router.put("/form/:id", updateForm);

module.exports = router;
