import { API } from "./api";

export const roleService = {
  async list(params = {}) {
    const response = await API.get("/api/roles", { params });
    return response.data;
  },

  async getPermissions() {
    const response = await API.get("/api/roles/permissions");
    return response.data;
  },

  async create(payload) {
    const response = await API.post("/api/roles", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await API.put(`/api/roles/${id}`, payload);
    return response.data;
  },

  async changeStatus(id, isActive) {
    const response = await API.patch(`/api/roles/${id}/status`, { isActive });
    return response.data;
  }
};





