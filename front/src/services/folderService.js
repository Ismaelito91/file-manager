import { api } from "./apiService";

export const getFolders = (parentId) => {
  const params = {};
  if (parentId) params.parent_id = parentId;
  return api.get("/folders", { params });
};

export const getFolder = (id) => api.get(`/folders/${id}`);

export const createFolder = (name, parentId) =>
  api.post("/folders", { name, parent_id: parentId || null });

export const renameFolder = (id, name) => api.put(`/folders/${id}`, { name });

export const deleteFolder = (id) => api.delete(`/folders/${id}`);
