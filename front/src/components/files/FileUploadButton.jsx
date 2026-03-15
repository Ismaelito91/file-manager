import { useRef } from "react";
import { Upload } from "lucide-react";

const FileUploadButton = ({ uploading, onUpload }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <button
        className="btn btn-neutral btn-sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="w-4 h-4" />
        {uploading ? "Upload..." : "Uploader un fichier"}
      </button>
    </>
  );
};

export default FileUploadButton;
