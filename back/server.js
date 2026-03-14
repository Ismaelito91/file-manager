import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database.js";
import userRouter from "./src/routes/user.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "success" });
});

app.use("/users", userRouter);

app.use(errorHandler);

const APP_PORT = process.env.APP_PORT || 3000;

connectDB();

app.listen(APP_PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`);
});
