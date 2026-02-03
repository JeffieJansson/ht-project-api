import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

//endpoint is /user/signup
// Here we can create a new user
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

      if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
     
    if (existingUser) {
      return  res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({email, password: hashedPassword});

    await user.save();
  
    res.status(200).json({
      success: true,
      message: "User created successfully", 
      response: {
        email: user.email,
        id: user._id,
        accessToken: user.accessToken,
      },
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      response: error,
    });
  }
});  

// endpoint is /user/login
// Here we can verify email and password and return accessToken
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
  
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        message: "Login successful",
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        response: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      response: error,
    });
  }
});

// export the router to be used in server.js
export default router;

