import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/folders.controllers.js";
import { authMiddleware } from "../middlewares/auth.js";

export const router = express.Router();

router.use(authMiddleware);

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.put("/:id", update);
router.delete("/:id", destroy);
