import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getPreviewUrl, previewFileBlob } from "../services/fileService";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"];
const PDF_TYPES = ["application/pdf"];
const TEXT_EXTENSIONS = [
  ".txt", ".json", ".js", ".jsx", ".ts", ".tsx", ".css", ".html",
  ".md", ".yml", ".yaml", ".xml", ".csv", ".env", ".sh", ".bat",
  ".py", ".java", ".c", ".cpp", ".h", ".sql", ".log",
];

function getPreviewType(file) {
  if (IMAGE_TYPES.includes(file.mimeType)) return "image";
  if (VIDEO_TYPES.includes(file.mimeType)) return "video";
  if (AUDIO_TYPES.includes(file.mimeType)) return "audio";
  if (PDF_TYPES.includes(file.mimeType)) return "pdf";
  if (TEXT_EXTENSIONS.some((ext) => file.extension?.toLowerCase() === ext)) return "text";
  return "unsupported";
}

const PreviewModal = ({ file, onClose }) => {
  const [textContent, setTextContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const type = getPreviewType(file);
  const url = getPreviewUrl(file._id);

  useEffect(() => {
    if (type !== "text") return;

    let cancelled = false;
    setLoading(true);
    previewFileBlob(file._id)
      .then((blob) => blob.text())
      .then((text) => {
        if (!cancelled) setTextContent(text);
      })
      .catch(() => {
        if (!cancelled) setTextContent("Impossible de charger le contenu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [file._id, type]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box w-11/12 max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg truncate pr-4">{file.name}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center min-h-[200px]">
          {type === "image" && (
            <img
              src={url}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          )}

          {type === "video" && (
            <video controls className="max-w-full max-h-[70vh] rounded">
              <source src={url} type={file.mimeType} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}

          {type === "audio" && (
            <div className="w-full flex flex-col items-center gap-4 py-8">
              <div className="text-5xl">🎵</div>
              <audio controls className="w-full max-w-md">
                <source src={url} type={file.mimeType} />
              </audio>
            </div>
          )}

          {type === "pdf" && (
            <iframe
              src={url}
              title={file.name}
              className="w-full h-[70vh] rounded border-0"
            />
          )}

          {type === "text" && (
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : (
                <pre className="bg-base-200 p-4 rounded overflow-auto max-h-[65vh] text-sm whitespace-pre-wrap break-words">
                  <code>{textContent}</code>
                </pre>
              )}
            </div>
          )}

          {type === "unsupported" && (
            <div className="text-center py-12 text-base-content/50">
              <p className="text-4xl mb-4">📄</p>
              <p className="text-lg font-medium">Prévisualisation non disponible</p>
              <p className="text-sm mt-1">
                Le format <span className="badge badge-ghost">{file.extension}</span> ne peut pas être prévisualisé.
              </p>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
