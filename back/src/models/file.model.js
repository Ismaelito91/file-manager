import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const File = mongoose.model("File", fileSchema);
