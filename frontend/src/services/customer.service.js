import { API } from "./api";

export const customerService = {
  /**
   * Listar clientes con paginación y filtros
   */
  async list(params = {}) {
    const response = await API.get("/api/customers", { params });
    return response.data;
  },

  /**
   * Obtener un cliente por ID
   */
  async getById(id) {
    const response = await API.get(`/api/customers/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo cliente
   */
  async create(payload) {
    const response = await API.post("/api/customers", payload);
    return response.data;
  },

  /**
   * Actualizar cliente
   */
  async update(id, payload) {
    const response = await API.put(`/api/customers/${id}`, payload);
    return response.data;
  },

  /**
   * Eliminar (cancelar) cliente
   */
  async delete(id) {
    const response = await API.delete(`/api/customers/${id}`);
    return response.data;
  },

  /**
   * Cambiar estado del cliente (active/suspended)
   */
  async changeStatus(id, status) {
    const response = await API.patch(`/api/customers/${id}/status`, { status });
    return response.data;
  },

  /**
   * Obtener estadísticas de clientes
   */
  async getStats() {
    const response = await API.get("/api/customers/stats");
    return response.data;
  }
};
