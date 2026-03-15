import { api } from "./apiService";

export const getFiles = (search) => {
  const params = {};
  if (search) params.search = search;
  return api.get("/files", { params });
};

export const getFile = (id) => api.get(`/files/${id}`);

export const getStats = () => api.get("/files/stats");

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
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
