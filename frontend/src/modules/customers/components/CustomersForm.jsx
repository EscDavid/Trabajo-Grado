import { useState, useEffect } from "react";
import "../index.css";
import { createCustomer, updateCustomer } from "../services/customers";

export default function CustomerForm({ initialData, onSuccess }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_primary: "",
    phone_secondary: "",
    document_type: "",
    document_number: "",
    billing_address: "",
    service_address: "",
    registration_date: "",
    status: "activo",
    notes: "",
    user_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateCustomer(initialData.id, form);
        alert("Cliente actualizado correctamente.");
      } else {
        await createCustomer(form);
        alert("Cliente creado exitosamente.");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Cliente" : "Nuevo Cliente"}</h3>

      <div className="form-grid">
        <input name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone_primary" placeholder="Teléfono principal" value={form.phone_primary} onChange={handleChange} required />
        <input name="phone_secondary" placeholder="Teléfono secundario" value={form.phone_secondary} onChange={handleChange} />
        <input name="document_type" placeholder="Tipo de documento" value={form.document_type} onChange={handleChange} required />
        <input name="document_number" placeholder="Número de documento" value={form.document_number} onChange={handleChange} required />
        <input name="billing_address" placeholder="Dirección de facturación" value={form.billing_address} onChange={handleChange} />
        <input name="service_address" placeholder="Dirección del servicio" value={form.service_address} onChange={handleChange} />
        <input type="date" name="registration_date" value={form.registration_date} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <textarea name="notes" placeholder="Notas" value={form.notes} onChange={handleChange}></textarea>
        <input name="user_id" placeholder="ID Usuario (Portal)" value={form.user_id} onChange={handleChange} />
      </div>

      <button type="submit" className="btn-save" disabled={loading}>
        {loading ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
