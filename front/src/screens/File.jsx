import { useEffect, useState, useRef } from "react";
import useTitle from "../hooks/useTitle";
import {
  getFiles,
  deleteFile,
  renameFile,
  downloadFile,
  uploadFile,
} from "../services/fileService";
import { FileSearchBar, FileUploadButton, FileTable } from "../components/files";
import PreviewModal from "../components/PreviewModal";

const File = () => {
  const { setTitle } = useTitle();

  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    setTitle("Fichiers");
    fetchFiles();
  }, []);

  const fetchFiles = async (search) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getFiles(search);
      setFiles(data);
    } catch {
      setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => fetchFiles(val.trim() || undefined),
      400
    );
  };

  const handleClearSearch = () => {
    setQuery("");
    fetchFiles();
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file);
      await fetchFiles(query.trim() || undefined);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
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
        <div className="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <FileSearchBar
            query={query}
            onChange={handleQueryChange}
            onClear={handleClearSearch}
          />
        </div>
        <FileUploadButton uploading={uploading} onUpload={handleUpload} />
      </div>

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
              : "Cliquez sur « Uploader un fichier » pour commencer."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/60">
            {query ? `Résultats pour "${query}" :` : "Tous les fichiers :"}{" "}
            {files.length} fichier(s)
          </p>
          <FileTable
            files={files}
            editingId={editingId}
            editName={editName}
            onEditNameChange={setEditName}
            onRenameConfirm={handleRenameConfirm}
            onRenameCancel={handleRenameCancel}
            onRenameStart={handleRenameStart}
            onPreview={setPreviewFile}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </>
      )}

      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default File;
