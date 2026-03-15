import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./src/middlewares/errorhandler.middleware.js";
import userRouter from "./src/routes/user.routes.js";
import fileRouter from "./src/routes/file.routes.js";
import connectDB from "./config/database.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(morgan("dev"));

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ error: false });
});

app.use("/users", userRouter);

app.use("/files", fileRouter);

const APP_PORT = process.env.APP_PORT || 3000;

connectDB();

app.listen(APP_PORT, () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`);
});
