import { Check, X } from "lucide-react";

const FileRenameInput = ({ value, onChange, onConfirm, onCancel }) => (
  <div className="flex items-center gap-2">
    <input
      type="text"
      className="input input-bordered input-sm w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirm();
        if (e.key === "Escape") onCancel();
      }}
      autoFocus
    />
    <button className="btn btn-ghost btn-sm btn-square" onClick={onConfirm}>
      <Check className="w-4 h-4 text-success" />
    </button>
    <button className="btn btn-ghost btn-sm btn-square" onClick={onCancel}>
      <X className="w-4 h-4 text-error" />
    </button>
  </div>
);

export default FileRenameInput;
