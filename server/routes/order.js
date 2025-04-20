import express from "express";
import pool from "../config/postgres.js";

const orderRouter = express.Router();

orderRouter.post("/", async (req, res) => {
  const { name, phone, cart } = req.body;

  if (!name || !phone || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  try {
    let user = await pool.query("SELECT * FROM users WHERE phone_number = $1", [
      phone,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "User must register before ordering." });
    }

    const userId = user.rows[0].id;

    const orderRes = await pool.query(
      "INSERT INTO orders (user_id) VALUES ($1) RETURNING *",
      [userId]
    );

    const orderId = orderRes.rows[0].id;

    for (let item of cart) {
      await pool.query(
        "INSERT INTO order_items (order_id, item_name, price, quantity) VALUES ($1, $2, $3, $4)",
        [orderId, item.name, item.price, item.quantity]
      );
    }

    res.status(201).json({ message: "Order placed successfully!", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

orderRouter.get("/:phone", async (req, res) => {
  const { phone } = req.params;
  try {
    const userRes = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [phone]
    );
    if (userRes.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const userId = userRes.rows[0].id;
    const orders = await pool.query(
      `SELECT o.id as order_id, o.created_at, oi.item_name, oi.price, oi.quantity 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = $1`,
      [userId]
    );

    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default orderRouter;
