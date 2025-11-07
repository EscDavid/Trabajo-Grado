// src/services/customers.js
import { API } from "./api";

// Obtener todos los clientes
export const getCustomers = () => API.get("/customers");

// Obtener un cliente por ID
export const getCustomerById = (id) => API.get(`/customers/${id}`);

// Crear un nuevo cliente
export const createCustomer = (data) => API.post("/customers", data);

// Actualizar un cliente
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);

// Cambiar estado de un cliente
export const changeCustomerStatus = (id, status) =>
  API.patch(`/customers/${id}/status`, { status });

// Eliminar (borrado lógico)
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);
