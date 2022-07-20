const express = require("express");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with the same email already exists!" });
    }

    //const hashedPassword = await bcryptjs.hash(password, 8);
    var cpass = CryptoJS.AES.encrypt(password, "secret key 123").toString();
    let user = new User({
      email,
      password: cpass,
      //hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if(!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
      return res.status(400).json({msg: "Enter a valid Email please!"});
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with the same email does not exist!" });
    }
    var bytes = CryptoJS.AES.decrypt(user.password, 'secret key 123');
    var dpass = bytes.toString(CryptoJS.enc.Utf8);
    const isMatch =
      dpass == password;
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Incorrect password!" });
    }

    const token = jwt.sign({id: user._id}, "passwordKey");
    res.json({token, ...user._doc});

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token){
      return res.json(false);
    }
    const verified = jwt.verify(token, 'passwordKey');
    if(!verified){
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if(!user){
      return res.json(false);
    }

    res.json(true);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({...user._doc, token: req.token});
});

module.exports = authRouter;
