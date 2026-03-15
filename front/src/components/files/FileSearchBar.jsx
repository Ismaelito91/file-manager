import { Search, X } from "lucide-react";

const FileSearchBar = ({ query, onChange, onClear }) => (
  <div className="form-control">
    <div className="input input-bordered flex items-center gap-2">
      <Search className="w-4 h-4 text-base-content/50" />
      <input
        type="text"
        className="grow bg-transparent outline-none"
        placeholder="Rechercher un fichier..."
        value={query}
        onChange={onChange}
      />
      {query && (
        <button className="btn btn-ghost btn-xs btn-circle" onClick={onClear}>
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

export default FileSearchBar;
