import { useEffect, useState, useRef } from "react";
import useTitle from "../hooks/useTitle";
import {
  getFiles,
  uploadFile,
  deleteFile,
  renameFile,
  downloadFile,
} from "../services/fileService";
import { Upload, Download, Trash2, Pencil, X, Check } from "lucide-react";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const File = () => {
  const { setTitle } = useTitle();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle("Files");
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getFiles();
      setFiles(data);
    } catch (err) {
      setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file);
      await fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    setError(null);
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleRenameStart = (file) => {
    setEditingId(file._id);
    setEditName(file.name);
  };

  const handleRenameConfirm = async (id) => {
    if (!editName.trim()) return;
    setError(null);
    try {
      await renameFile(id, editName.trim());
      setFiles((prev) =>
        prev.map((f) => (f._id === id ? { ...f, name: editName.trim() } : f))
      );
      setEditingId(null);
    } catch (err) {
      setError("Erreur lors du renommage.");
    }
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDownload = async (file) => {
    setError(null);
    try {
      await downloadFile(file._id, file.name);
    } catch (err) {
      setError("Erreur lors du téléchargement.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          className="btn btn-neutral"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Upload en cours..." : "Uploader un fichier"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          <p className="text-lg">Aucun fichier</p>
          <p className="text-sm mt-1">Uploadez un fichier pour commencer.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Taille</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>
                    {editingId === file._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameConfirm(file._id);
                            if (e.key === "Escape") handleRenameCancel();
                          }}
                          autoFocus
                        />
                        <button
                          className="btn btn-ghost btn-sm btn-square"
                          onClick={() => handleRenameConfirm(file._id)}
                        >
                          <Check className="w-4 h-4 text-success" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-square"
                          onClick={handleRenameCancel}
                        >
                          <X className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium">{file.name}</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {file.extension}
                    </span>
                  </td>
                  <td>{formatSize(file.size)}</td>
                  <td className="text-sm text-base-content/60">
                    {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => handleDownload(file)}
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => handleRenameStart(file)}
                        title="Renommer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-square text-error"
                        onClick={() => handleDelete(file._id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default File;
