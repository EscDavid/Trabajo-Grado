import { useEffect, useState } from "react";
import "../index.css";
import { getCustomers, deleteCustomer } from "../services/customers";

export default function CustomersTable({ onEdit }) {
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
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-2 py-1 text-left">ID</th>
            <th className="px-2 py-1 text-left">Nombre completo</th>
            <th className="px-2 py-1 text-left">Email</th>
            <th className="px-2 py-1 text-left">Tel. principal</th>
            <th className="px-2 py-1 text-left">Tel. secundario</th>
            <th className="px-2 py-1 text-left">Documento</th>
            <th className="px-2 py-1 text-left">Direcciones</th>
            <th className="px-2 py-1 text-left">Registro</th>
            <th className="px-2 py-1 text-left">Estado</th>
            <th className="px-2 py-1 text-left">Notas</th>
            <th className="px-2 py-1 text-left">Usuario Portal</th>
            <th className="px-2 py-1 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.length ? (
            customers.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1">{c.id}</td>
                <td className="px-2 py-1">{c.first_name} {c.last_name}</td>
                <td className="px-2 py-1 text-gray-800">{c.email}</td>
                <td className="px-2 py-1 text-gray-800">{c.phone_primary}</td>
                <td className="px-2 py-1 text-gray-800">{c.phone_secondary}</td>
                <td className="px-2 py-1 text-gray-800">{c.document_type} {c.document_number}</td>
                <td className="px-2 py-1 text-gray-600">
                  <div>Facturación: {c.billing_address}</div>
                  <div>Servicio: {c.service_address}</div>
                </td>
                <td className="px-2 py-1 text-gray-600">{c.registration_date}</td>
                <td className="px-2 py-1">
                  <span
                    className={`px-1 py-0.5 rounded-full text-[0.65rem] font-medium ${
                      c.status === "active"
                        ? "bg-green-100 text-green-800"
                        : c.status === "pending_activation"
                        ? "bg-yellow-100 text-yellow-800"
                        : c.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-2 py-1 text-gray-600">{c.notes}</td>
                <td className="px-2 py-1 text-gray-600">{c.user_id}</td>
                <td className="px-2 py-1">
<div className="flex gap-1">
  <button
    className="px-2 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
    onClick={() => onEdit(c)}
  >
    Editar
  </button>
  <button
    className="px-2 py-1 text-sm font-medium bg-red-100 text-red-800 rounded hover:bg-red-200"
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
              <td colSpan="12" className="text-center py-2 text-[0.65rem] text-gray-400">
                No hay clientes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
