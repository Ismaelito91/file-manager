import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import fs from "node:fs";

export const index = catchAsync(async (req, res) => {
  const { parent_id } = req.query;
  const filter = { parent_id: parent_id || null };
  const folders = await Folder.find(filter).sort({ name: 1 });
  return res.json(folders);
});

export const show = catchAsync(async (req, res) => {
  const folder = await Folder.findById(req.params.id);
  if (!folder) throw new AppError("Dossier non trouvé.", 404);

  const breadcrumb = [];
  let current = folder;
  while (current) {
    breadcrumb.unshift({ id: current._id, name: current.name });
    current = current.parent_id
      ? await Folder.findById(current.parent_id)
      : null;
  }

  return res.json({ folder, breadcrumb });
});

export const store = catchAsync(async (req, res) => {
  const { name, parent_id } = req.body;
  if (!name) throw new AppError("Le nom du dossier est obligatoire.", 400);

  if (parent_id) {
    const parent = await Folder.findById(parent_id);
    if (!parent) throw new AppError("Dossier parent introuvable.", 404);
  }

  const folder = await Folder.create({ name, parent_id: parent_id || null });
  return res.status(201).json(folder);
});

export const update = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError("Le nom est obligatoire.", 400);

  const folder = await Folder.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!folder) throw new AppError("Dossier non trouvé.", 404);
  return res.json(folder);
});

const deleteFolderRecursive = async (folderId) => {
  const files = await File.find({ folder_id: folderId });
  for (const file of files) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await File.findByIdAndDelete(file._id);
  }

  const subFolders = await Folder.find({ parent_id: folderId });
  for (const sub of subFolders) {
    await deleteFolderRecursive(sub._id);
  }

  await Folder.findByIdAndDelete(folderId);
};

export const destroy = catchAsync(async (req, res) => {
  const folder = await Folder.findById(req.params.id);
  if (!folder) throw new AppError("Dossier non trouvé.", 404);

  await deleteFolderRecursive(folder._id);
  return res.status(204).send();
});
