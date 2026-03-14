import { useEffect, useState, useRef } from "react";
import useTitle from "../hooks/useTitle";
import {
  getFolders,
  getFolder,
  createFolder,
  renameFolder,
  deleteFolder,
} from "../services/folderService";
import {
  getFiles,
  uploadFile,
  deleteFile,
  renameFile,
  downloadFile,
} from "../services/fileService";
import {
  FolderOpen,
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Pencil,
  X,
  Check,
  ChevronRight,
  Home as HomeIcon,
  Eye,
} from "lucide-react";
import PreviewModal from "../components/PreviewModal";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const Home = () => {
  const { setTitle } = useTitle();
  const fileInputRef = useRef(null);

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [editName, setEditName] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    setTitle("Home");
  }, []);

  useEffect(() => {
    fetchContent();
  }, [currentFolderId]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [foldersRes, filesRes] = await Promise.all([
        getFolders(currentFolderId),
        getFiles(currentFolderId),
      ]);
      setFolders(foldersRes.data);
      setFiles(filesRes.data);

      if (currentFolderId) {
        const { data } = await getFolder(currentFolderId);
        setBreadcrumb(data.breadcrumb);
      } else {
        setBreadcrumb([]);
      }
    } catch {
      setError("Impossible de charger le contenu.");
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (folderId) => {
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setError(null);
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName("");
      setShowNewFolder(false);
      await fetchContent();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du dossier.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file, currentFolderId);
      await fetchContent();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRenameStart = (id, type, name) => {
    setEditingId(id);
    setEditingType(type);
    setEditName(name);
  };

  const handleRenameConfirm = async () => {
    if (!editName.trim()) return;
    setError(null);
    try {
      if (editingType === "folder") {
        await renameFolder(editingId, editName.trim());
      } else {
        await renameFile(editingId, editName.trim());
      }
      setEditingId(null);
      await fetchContent();
    } catch {
      setError("Erreur lors du renommage.");
    }
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDeleteFolder = async (id) => {
    if (!confirm("Supprimer ce dossier et tout son contenu ?")) return;
    setError(null);
    try {
      await deleteFolder(id);
      await fetchContent();
    } catch {
      setError("Erreur lors de la suppression du dossier.");
    }
  };

  const handleDeleteFile = async (id) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    setError(null);
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleDownload = async (file) => {
    setError(null);
    try {
      await downloadFile(file._id, file.name);
    } catch {
      setError("Erreur lors du téléchargement.");
    }
  };

  const renderEditCell = (id, name) => {
    if (editingId === id) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input input-bordered input-sm flex-1"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameConfirm();
              if (e.key === "Escape") handleRenameCancel();
            }}
            autoFocus
          />
          <button className="btn btn-ghost btn-sm btn-square" onClick={handleRenameConfirm}>
            <Check className="w-4 h-4 text-success" />
          </button>
          <button className="btn btn-ghost btn-sm btn-square" onClick={handleRenameCancel}>
            <X className="w-4 h-4 text-error" />
          </button>
        </div>
      );
    }
    return <span className="font-medium">{name}</span>;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="alert alert-error text-sm"><span>{error}</span></div>
      )}

      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <button
              className="flex items-center gap-1 hover:underline"
              onClick={() => navigateTo(null)}
            >
              <HomeIcon className="w-4 h-4" /> Racine
            </button>
          </li>
          {breadcrumb.map((item) => (
            <li key={item.id}>
              <button
                className="hover:underline"
                onClick={() => navigateTo(item.id)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowNewFolder(!showNewFolder)}
        >
          <FolderPlus className="w-4 h-4" /> Nouveau dossier
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
        <button
          className="btn btn-neutral btn-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Upload..." : "Uploader un fichier"}
        </button>
      </div>

      {/* Nouveau dossier inline */}
      {showNewFolder && (
        <div className="flex items-center gap-2 max-w-sm">
          <input
            type="text"
            className="input input-bordered input-sm flex-1"
            placeholder="Nom du dossier"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") { setShowNewFolder(false); setNewFolderName(""); }
            }}
            autoFocus
          />
          <button className="btn btn-neutral btn-sm" onClick={handleCreateFolder}>
            Créer
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setShowNewFolder(false); setNewFolderName(""); }}
          >
            Annuler
          </button>
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          <p className="text-lg">Dossier vide</p>
          <p className="text-sm mt-1">Créez un dossier ou uploadez un fichier.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
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
              {/* Dossiers */}
              {folders.map((folder) => (
                <tr key={folder._id} className="hover">
                  <td>
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-warning" />
                      {editingId === folder._id ? (
                        renderEditCell(folder._id, folder.name)
                      ) : (
                        <button
                          className="font-medium hover:underline"
                          onClick={() => navigateTo(folder._id)}
                        >
                          {folder.name}
                        </button>
                      )}
                    </div>
                  </td>
                  <td><span className="badge badge-ghost badge-sm">Dossier</span></td>
                  <td>—</td>
                  <td className="text-sm text-base-content/60">
                    {new Date(folder.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => handleRenameStart(folder._id, "folder", folder.name)}
                        title="Renommer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-square text-error"
                        onClick={() => handleDeleteFolder(folder._id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Fichiers */}
              {files.map((file) => (
                <tr key={file._id} className="hover">
                  <td>{renderEditCell(file._id, file.name)}</td>
                  <td><span className="badge badge-ghost badge-sm">{file.extension}</span></td>
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
                        onClick={() => handleRenameStart(file._id, "file", file.name)}
                        title="Renommer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-square text-error"
                        onClick={() => handleDeleteFile(file._id)}
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
      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default Home;
