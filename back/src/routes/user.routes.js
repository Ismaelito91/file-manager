import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
//
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
//
import {
  destroy,
  index,
  login,
  show,
  store,
  update,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", validate(registerSchema), store);
router.get("/", authMiddleware, index);
router.get("/:id", authMiddleware, show);
router.put("/:id", authMiddleware, validate(updateUserSchema), update);
router.delete("/:id", authMiddleware, destroy);
router.post("/login", validate(loginSchema), login);

export default router;
