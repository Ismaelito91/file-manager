import path from "node:path";
import fs from "node:fs";
import File from "../models/file.model.js";
import AppError from "../utils/apperror.util.js";
import asyncHandler from "../utils/asynchandler.js";

export const index = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { user_id: req.user.sub };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const files = await File.find(filter).sort({ name: 1 });
  return res.json(files);
});

export const show = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user_id: req.user.sub,
  });
  if (!file) throw new AppError("File not found.", 404);
  return res.json(file);
});

export const store = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded.", 400);

  const { originalname, mimetype, path: filePath, size } = req.file;

  const file = await File.create({
    name: originalname,
    mimeType: mimetype,
    size,
    path: filePath,
    extension: path.extname(originalname),
    user_id: req.user.sub,
  });

  return res.status(201).json(file);
});

export const update = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError("Name is required.", 400);

  const file = await File.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.sub },
    { name },
    { new: true },
  );

  if (!file) throw new AppError("File not found.", 404);
  return res.json(file);
});

export const destroy = asyncHandler(async (req, res) => {
  const file = await File.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user.sub,
  });
  if (!file) throw new AppError("File not found.", 404);

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  return res.status(204).send();
});

export const stats = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  const [totalFiles, result, recentFiles] = await Promise.all([
    File.countDocuments({ user_id: userId }),
    File.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]),
    File.find({ user_id: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  return res.json({
    totalFiles,
    totalSize: result[0]?.totalSize || 0,
    recentFiles,
  });
});

export const download = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user_id: req.user.sub,
  });
  if (!file) throw new AppError("File not found.", 404);

  if (!fs.existsSync(file.path)) {
    throw new AppError("Physical file not found.", 404);
  }

  return res.download(file.path, file.name);
});

export const preview = asyncHandler(async (req, res) => {
  const file = await File.findOne({
    _id: req.params.id,
    user_id: req.user.sub,
  });
  if (!file) throw new AppError("File not found.", 404);

  const absPath = path.resolve(file.path);
  if (!fs.existsSync(absPath)) {
    throw new AppError("Physical file not found.", 404);
  }

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
  fs.createReadStream(absPath).pipe(res);
});
