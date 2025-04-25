import express from "express";
import cors from "cors";
import "dotenv/config";
import menuRouter from "./routes/menu.js";
import orderRouter from "./routes/order.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is Working");
});
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
