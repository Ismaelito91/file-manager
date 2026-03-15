import { Eye, Download, Pencil, Trash2 } from "lucide-react";

const FileActions = ({ onPreview, onDownload, onRename, onDelete }) => (
  <div className="flex justify-end gap-1">
    <button
      className="btn btn-ghost btn-sm btn-square"
      onClick={onPreview}
      title="Prévisualiser"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
      className="btn btn-ghost btn-sm btn-square"
      onClick={onDownload}
      title="Télécharger"
    >
      <Download className="w-4 h-4" />
    </button>
    <button
      className="btn btn-ghost btn-sm btn-square"
      onClick={onRename}
      title="Renommer"
    >
      <Pencil className="w-4 h-4" />
    </button>
    <button
      className="btn btn-ghost btn-sm btn-square text-error"
      onClick={onDelete}
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export default FileActions;
