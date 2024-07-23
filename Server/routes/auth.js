const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ooooooooop";

// ROUTE 1: Create a user using Post "/api/auth/createuser" NOT require login
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").notEmpty().isLength({ min: 3 }),
    body("email", "Enter valid email").notEmpty().isEmail(),
    body("password", "Password must atleast 6 characters")
      .notEmpty()
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    // If there errors return bad request and also errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({success, errors: result.array() });
    }

    try {
      //check user email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "sorry a user exist with this email" });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 2: Authenticate a user using Post "/api/auth/login" NOT require login
router.post(
  "/login",
  [
    body("email", "Enter valid email").notEmpty().isEmail(),
    body("password", "Password must atleast 6 characters")
      .notEmpty()
      .isLength({ min: 6 })
      .exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there errors return bad request and also errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      //check user email already exist
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ error: "Enter correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Enter correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get logged user details using Post "/api/auth/getuser"  required login
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
