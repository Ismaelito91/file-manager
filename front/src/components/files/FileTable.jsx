import FileRow from "./FileRow";

const FileTable = ({
  files,
  editingId,
  editName,
  onEditNameChange,
  onRenameConfirm,
  onRenameCancel,
  onRenameStart,
  onPreview,
  onDownload,
  onDelete,
}) => (
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
          <FileRow
            key={file._id}
            file={file}
            isEditing={editingId === file._id}
            editName={editName}
            onEditNameChange={onEditNameChange}
            onRenameConfirm={() => onRenameConfirm(file._id)}
            onRenameCancel={onRenameCancel}
            onRenameStart={() => onRenameStart(file)}
            onPreview={() => onPreview(file)}
            onDownload={() => onDownload(file)}
            onDelete={() => onDelete(file._id)}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default FileTable;
