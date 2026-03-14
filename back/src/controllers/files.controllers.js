import path from "node:path";
import fs from "node:fs";
import { File } from "../models/file.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const index = catchAsync(async (req, res) => {
  const files = await File.find();
  return res.json(files);
});

export const show = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) throw new AppError("Fichier non trouvé.", 404);
  return res.json(file);
});

export const store = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Aucun fichier envoyé.", 400);

  const { originalname, mimetype, path: filePath, size } = req.file;
  const ext = path.extname(originalname);

  const file = await File.create({
    name: originalname,
    mimeType: mimetype,
    size,
    path: filePath,
    extension: ext,
  });

  return res.status(201).json(file);
});

export const update = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError("Le nom est obligatoire.", 400);

  const file = await File.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true },
  );

  if (!file) throw new AppError("Fichier non trouvé.", 404);
  return res.json(file);
});

export const destroy = catchAsync(async (req, res) => {
  const file = await File.findByIdAndDelete(req.params.id);
  if (!file) throw new AppError("Fichier non trouvé.", 404);

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  return res.status(204).send();
});

export const download = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) throw new AppError("Fichier non trouvé.", 404);

  if (!fs.existsSync(file.path)) {
    throw new AppError("Le fichier physique est introuvable.", 404);
  }

  return res.download(file.path, file.name);
});
