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
    status: "pending_activation",
    notes: "",
    user_id: "",
    zone: "", // ✅ Nuevo campo
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
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
    <form className="customer-form max-w-[750px]" onSubmit={handleSubmit}>
      <h3 className="text-sm font-semibold mb-2">
        {initialData ? "Editar Cliente" : "Nuevo Cliente"}
      </h3>

      <div className="grid grid-cols-2 gap-2 text-xs">
        
        <label className="flex flex-col">
          Nombre
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
        </label>

        <label className="flex flex-col">
          Apellido
          <input name="last_name" value={form.last_name} onChange={handleChange} required />
        </label>

        <label className="flex flex-col">
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="flex flex-col">
          Teléfono principal
          <input name="phone_primary" value={form.phone_primary} onChange={handleChange} required />
        </label>

        <label className="flex flex-col">
          Teléfono secundario
          <input name="phone_secondary" value={form.phone_secondary} onChange={handleChange} />
        </label>

        <label className="flex flex-col">
          Tipo documento
          <input name="document_type" value={form.document_type} onChange={handleChange} required />
        </label>

        <label className="flex flex-col">
          Nº documento
          <input name="document_number" value={form.document_number} onChange={handleChange} required />
        </label>

        <label className="flex flex-col col-span-2">
          Dirección de facturación
          <input name="billing_address" value={form.billing_address} onChange={handleChange} required />
        </label>

        <label className="flex flex-col col-span-2">
          Dirección de servicio
          <input name="service_address" value={form.service_address} onChange={handleChange} />
        </label>

        {/* ✅ Nueva zona (Norte / Sur) */}
        <label className="flex flex-col">
          Zona
          <select name="zone" value={form.zone} onChange={handleChange} required>
            <option value="">Seleccionar</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
          </select>
        </label>

        <label className="flex flex-col">
          Estado
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending_activation">Pendiente de Activación</option>
            <option value="active">Activo</option>
            <option value="suspended_nonpayment">Suspendido por Falta de Pago</option>
            <option value="suspended_admin">Suspendido por Admin</option>
            <option value="delinquent">Moroso</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </label>

        <label className="flex flex-col col-span-2">
          Notas
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </label>

        <label className="flex flex-col">
          ID Usuario (Portal)
          <input name="user_id" value={form.user_id} onChange={handleChange} />
        </label>

        <label className="flex flex-col">
          Fecha de registro
          <input name="registration_date" type="date" value={form.registration_date} onChange={handleChange} required />
        </label>

      </div>

      <button type="submit" className="btn-save mt-3 text-xs px-3 py-1" disabled={loading}>
        {loading ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
