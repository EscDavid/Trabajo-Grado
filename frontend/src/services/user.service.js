import { API } from "./api";

export const userService = {
  async list(params = {}) {
    const response = await API.get("/api/users", { params });
    return response.data;
  },

  async create(payload) {
    const response = await API.post("/api/auth/register", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await API.put(`/api/users/${id}`, payload);
    return response.data;
  },

  async changeStatus(id, isActive) {
    const response = await API.patch(`/api/users/${id}/status`, { isActive });
    return response.data;
  }
};





