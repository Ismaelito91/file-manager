import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const router = express.Router();

// Créer un utilisateur (inscription)
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Un utilisateur avec cet email existe déjà." });
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Lister tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Récupérer un utilisateur par id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Mettre à jour un utilisateur
router.put("/:id", async (req, res) => {
  try {
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
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Login (authentification)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont obligatoires." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides." });
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

export default router;

