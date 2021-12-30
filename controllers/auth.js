const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/keys");

exports.signupController = async (req, res) => {
  // destructure incoming userdata
  // console.log(req.body)
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errorMessage: "Email already exist",
      });
    }

    // creating a new instance
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;

    // gen salt (hashing the password)
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // save new user to database
    await newUser.save();

    res.json({
      successMessage: "Registration success. Please signin",
    });

    // console.log(newUser.password);
  } catch (err) {
    console.log("signup controller error", err);
    res.status(500).json({
      errorMessage: "Server error",
    });
  }
};

exports.signinController = async (req, res) => {
  // destructure incoming userdata
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errorMessage: "invalid credentials",
      });
    }

    // jwt payload
    const payload = {
      user: {
        _id: user._id,
      },
    };
 
    jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire }, (err, token) => {
      if (err) console.log("jwt error", err);
      const { _id, username, email, role } = user;

      // if successfull send back token and destructured user above
      res.json({
        token,
        user: { _id, username, email, role },
      });
    });
  } catch (err) {
    console.log("signinController err", err);
    res.status(500).json({
      errorMessage: "Server error",
    });
  }
};
