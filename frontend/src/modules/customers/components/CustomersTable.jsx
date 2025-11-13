import { useEffect, useState } from "react";
import "../index.css";
import { getCustomers, deleteCustomer } from "../services/customers";

export default function CustomersTable({ onEdit, onView }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error("Error al traer clientes:", err);
      alert("Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
      alert("Cliente eliminado correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente.");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Cargando clientes...</p>;

  return (
<div className="w-[98%] mx-auto mt-2"> 
  <table className="w-full text-[13px] text-gray-700">

    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-3 py-2 text-left font-medium">Estatus</th>
        <th className="px-3 py-2 text-left font-medium">Cliente</th>
        <th className="px-3 py-2 text-left font-medium">Email</th>
        <th className="px-3 py-2 text-left font-medium">Teléfono</th>
        <th className="px-3 py-2 text-left font-medium">Documento</th>
        <th className="px-3 py-2 text-left font-medium">Direcciones</th>
        <th className="px-3 py-2 text-left font-medium">Notas</th>
        <th className="px-3 py-2 text-left font-medium">Portal</th>
        <th className="px-3 py-2 text-left font-medium">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {customers.length ? (
        customers.map((c) => (
          <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
            <td className="px-3 py-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${
                  c.status === "active"
                    ? "bg-green-100 text-green-800"
                    : c.status === "pending_activation"
                    ? "bg-yellow-100 text-yellow-800"
                    : c.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-200 text-gray-800"
                }`}>
                {c.status}
              </span>
            </td>
            <td className="px-3 py-2">{c.first_name} {c.last_name}</td>
            <td className="px-3 py-2">{c.email}</td>
            <td className="px-3 py-2">{c.phone_primary}</td>
            <td className="px-3 py-2">{c.document_type}: {c.document_number}</td>
            <td className="px-3 py-2 text-xs">
              <div>F: {c.billing_address}</div>
              <div>S: {c.service_address}</div>
            </td>
            <td className="px-3 py-2 text-xs">{c.notes || "-"}</td>
            <td className="px-3 py-2 text-xs">{c.user_id || "-"}</td>

            <td className="px-3 py-2">
              <div className="flex gap-1">
                <button
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  onClick={() => onView(c)}
                >
                  Ver
                </button>
                <button
                  className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  onClick={() => onEdit(c)}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded hover:bg-red-200"
                  onClick={() => handleDelete(c.id)}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center py-4 text-sm text-gray-400">
            No hay clientes disponibles
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  );
}
