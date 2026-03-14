import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID invalide." });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({ message: `Doublon détecté sur le champ : ${field}.` });
  }

  console.error(err);
  return res.status(500).json({ message: "Erreur serveur." });
};
