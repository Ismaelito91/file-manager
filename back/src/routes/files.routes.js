import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/files.controllers.js";
import { upload } from "../middlewares/files.middlewares.js";

export const router = express.Router();

router.get("/", index);
router.get("/:id", show);
router.post("/", upload.single("file"), store);
router.put("/:id", update);
router.delete("/:id", destroy);
