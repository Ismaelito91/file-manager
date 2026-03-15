import { formatSize } from "../../utils/formatSize";
import FileActions from "./FileActions";
import FileRenameInput from "./FileRenameInput";

const FileRow = ({
  file,
  isEditing,
  editName,
  onEditNameChange,
  onRenameConfirm,
  onRenameCancel,
  onRenameStart,
  onPreview,
  onDownload,
  onDelete,
}) => (
  <tr>
    <td>
      {isEditing ? (
        <FileRenameInput
          value={editName}
          onChange={onEditNameChange}
          onConfirm={onRenameConfirm}
          onCancel={onRenameCancel}
        />
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
      <FileActions
        onPreview={onPreview}
        onDownload={onDownload}
        onRename={onRenameStart}
        onDelete={onDelete}
      />
    </td>
  </tr>
);

export default FileRow;
