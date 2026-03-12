import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(morgan("dev"));

const APP_PORT = process.env.APP_PORT || 3000;

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "success" });
});

console.log(process.env.APP_PORT);

connectDB();

app.listen(APP_PORT, () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`);
});
