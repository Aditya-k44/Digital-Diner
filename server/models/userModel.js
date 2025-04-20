import pool from "../config/postgres.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (name, phone, password) => {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE phone_number = $1",
    [phone]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    "INSERT INTO users (name, phone_number, password) VALUES ($1, $2, $3) RETURNING *",
    [name, phone, hashedPassword]
  );

  return newUser.rows[0];
};

const loginUser = async (phone, password) => {
  const userRes = await pool.query(
    "SELECT * FROM users WHERE phone_number = $1",
    [phone]
  );

  if (userRes.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userRes.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone_number, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { token, user };
};

export { registerUser, loginUser };
