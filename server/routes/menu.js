import express from "express";
import Menu from "../models/MenuItem.js";

const menuRouter = express.Router();

menuRouter.get("/", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default menuRouter;
