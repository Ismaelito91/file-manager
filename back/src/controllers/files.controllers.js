import { File } from "../models/file.model.js";

export const index = async (req, res) => {
  try {
    const files = await File.find();
    return res.status(200).json({ status: "success", data: files });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ status: "failed" });
  }
};

export const show = async (req, res) => {
  try {
    const file = (await File.findById(req.params.id)) || [];
    return res.status(200).json({ status: "success", data: file });
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "success" });
  }
};

export const store = async (req, res) => {
  try {
    if (req.file) {
      const { originalname, mimetype, path, size } = req.file;
      const file = new File({
        name: originalname,
        mimeType: mimetype,
        size: size,
        path: path,
        extension: ".txt",
      });
      file.save();
      return res.status(200).json({ status: "success", data: file });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ status: "failed" });
  }
};

export const update = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
      },
      { returnDocument: "after" },
    );
    return res.status(200).json({ status: "success", data: updatedFile });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ status: "failed" });
  }
};

export const destroy = async (req, res) => {
  try {
    const updatedFile = await File.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ status: "failed" });
  }
};
