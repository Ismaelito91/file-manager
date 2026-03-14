import { api } from "./apiService";

export const getFiles = (folderId) => {
  const params = {};
  if (folderId) params.folder_id = folderId;
  return api.get("/files", { params });
};

export const getAllFiles = () => api.get("/files", { params: { all: true } });

export const searchFiles = (query) =>
  api.get("/files", { params: { search: query } });

export const getFile = (id) => api.get(`/files/${id}`);

export const uploadFile = (file, folderId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folderId) formData.append("folder_id", folderId);
  return api.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const renameFile = (id, name) => api.put(`/files/${id}`, { name });

export const deleteFile = (id) => api.delete(`/files/${id}`);

export const getPreviewUrl = (id) => {
  const token = localStorage.getItem("auth_token");
  return `http://localhost:3000/files/${id}/preview?token=${token}`;
};

export const previewFileBlob = async (id) => {
  const response = await api.get(`/files/${id}/preview`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadFile = async (id, filename) => {
  const response = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
