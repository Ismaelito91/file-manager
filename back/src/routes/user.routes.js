import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validators/user.validator.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

// Créer un utilisateur (inscription)
router.post("/", validate(registerSchema), catchAsync(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Un utilisateur avec cet email existe déjà.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });
}));

// ========== Routes protégées (token JWT requis) ==========

// Lister tous les utilisateurs
router.get("/", authMiddleware, catchAsync(async (req, res) => {
  const users = await User.find({}, "-password");
  return res.json(users);
}));

// Récupérer un utilisateur par id
router.get("/:id", authMiddleware, catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  if (!user) {
    throw new AppError("Utilisateur non trouvé.", 404);
  }
  return res.json(user);
}));

// Mettre à jour un utilisateur
router.put("/:id", authMiddleware, validate(updateUserSchema), catchAsync(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const update = { first_name, last_name, email };

  if (password) {
    update.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
    select: "-password",
  });

  if (!user) {
    throw new AppError("Utilisateur non trouvé.", 404);
  }

  return res.json(user);
}));

// Supprimer un utilisateur
router.delete("/:id", authMiddleware, catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError("Utilisateur non trouvé.", 404);
  }
  return res.status(204).send();
}));

// Login (authentification)
router.post("/login", validate(loginSchema), catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Identifiants invalides.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Identifiants invalides.", 401);
  }

  const payload = { sub: user._id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "changeme", {
    expiresIn: "1h",
  });

  return res.json({
    token,
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  });
}));

export default router;
