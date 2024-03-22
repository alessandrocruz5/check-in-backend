var express = require("express");
var router = express.Router();
const CheckIn = require("../models/checkin.model");
const User = require("../models/user.model");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var app = express();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done;
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

/* GET home page. */
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

// router.get("/form/:id", getFormById);

// router.post("/newForm", async (req, res) => {
//   console.log(req.body);
//   const form = new CheckIn(req.body);

//   try {
//     const newForm = await form.save();
//     res.status(201).json(newForm);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.delete("/form/:id", deleteForm);

// router.put("/form/:id", updateForm);

module.exports = router;
