import express from "express";
import { registerUser, loginUser } from "../models/userModel.js";
import authenticate from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    if (!name || !phone || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    console.log("Received data:", { name, phone, password });
    const newUser = await registerUser(name, phone, password);
    res.status(201).json({
      message: "User created successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const { token, user } = await loginUser(phone, password);
    res.status(200).json({
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/logout", authenticate, (req, res) => {
  res.status(200).json({
    message: "Logged out successfully.",
  });
});

export default userRouter;
