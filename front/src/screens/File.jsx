import { useEffect, useState, useRef, useCallback } from "react";
import useTitle from "../hooks/useTitle";
import {
  getAllFiles,
  searchFiles,
  deleteFile,
  renameFile,
  downloadFile,
} from "../services/fileService";
import PreviewModal from "../components/PreviewModal";
import { Search, Download, Trash2, Pencil, X, Check, Eye } from "lucide-react";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const File = () => {
  const { setTitle } = useTitle();
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setTitle("Files");
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllFiles();
      setFiles(data);
    } catch {
      setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
    }
  };

  const doSearch = useCallback(async (term) => {
    if (!term.trim()) {
      fetchAllFiles();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await searchFiles(term.trim());
      setFiles(data);
    } catch {
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  const handleClearSearch = () => {
    setQuery("");
    fetchAllFiles();
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    setError(null);
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch {
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
    } catch {
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
    } catch {
      setError("Erreur lors du téléchargement.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="alert alert-error text-sm"><span>{error}</span></div>
      )}

      {/* Barre de recherche */}
      <div className="form-control">
        <div className="input input-bordered flex items-center gap-2">
          <Search className="w-4 h-4 text-base-content/50" />
          <input
            type="text"
            className="grow bg-transparent outline-none"
            placeholder="Rechercher un fichier..."
            value={query}
            onChange={handleQueryChange}
          />
          {query && (
            <button
              className="btn btn-ghost btn-xs btn-circle"
              onClick={handleClearSearch}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          <p className="text-lg">{query ? "Aucun résultat" : "Aucun fichier"}</p>
          <p className="text-sm mt-1">
            {query
              ? `Aucun fichier ne correspond à "${query}".`
              : "Uploadez des fichiers depuis la page Home."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/60">
            {query ? `Résultats pour "${query}" :` : "Tous les fichiers :"} {files.length} fichier(s)
          </p>
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
                      <span className="badge badge-ghost badge-sm">{file.extension}</span>
                    </td>
                    <td>{formatSize(file.size)}</td>
                    <td className="text-sm text-base-content/60">
                      {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-sm btn-square"
                          onClick={() => setPreviewFile(file)}
                          title="Prévisualiser"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
        </>
      )}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default File;
