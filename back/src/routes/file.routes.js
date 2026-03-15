import express from "express";
//
import {
  destroy,
  index,
  show,
  stats,
  store,
  update,
  download,
  preview,
} from "../controllers/file.controller.js";
//
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", index);
router.get("/stats", stats);
router.get("/:id", show);
router.get("/:id/download", download);
router.get("/:id/preview", preview);
router.post("/", upload.single("file"), store);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
