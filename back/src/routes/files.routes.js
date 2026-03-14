import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
  download,
} from "../controllers/files.controllers.js";
import { upload } from "../middlewares/files.middlewares.js";
import { authMiddleware } from "../middlewares/auth.js";

export const router = express.Router();

router.use(authMiddleware);

router.get("/", index);
router.get("/:id", show);
router.get("/:id/download", download);
router.post("/", upload.single("file"), store);
router.put("/:id", update);
router.delete("/:id", destroy);
