import { api } from "./apiService";

export const getFiles = () => api.get("/files");

export const getFile = (id) => api.get(`/files/${id}`);

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const renameFile = (id, name) => api.put(`/files/${id}`, { name });

export const deleteFile = (id) => api.delete(`/files/${id}`);

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
