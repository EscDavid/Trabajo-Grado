import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer, createCustomer, updateCustomer } from "../services/customers";
import CustomersTable from "../components/CustomersTable";
import CustomersModal from "../components/CustomersModal";
import CustomersForm from "../components/CustomersForm";
import "../index.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreate = async (formData) => {
    await createCustomer(formData);
    setShowCustomersModal(false);
    loadCustomers();
  };

  const handleUpdate = async (formData) => {
    await updateCustomer(selectedCustomer.id, formData);
    setShowCustomersModal(false);
    setSelectedCustomer(null);
    loadCustomers();
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    loadCustomers();
  };

  const activeCount = customers.filter(c => c.status === "active").length;
  const pendingCount = customers.filter(c => c.status === "pending_activation").length;
  const cancelledCount = customers.filter(c => c.status === "cancelled").length;
  const totalCount = customers.length;

  if (loading) return <p className="text-sm text-gray-500">Cargando clientes...</p>;

  return (
    <div className="customers-page">
      {/* Título */}
      <h2 className="font-semibold text-gray-800 mb-4 text-start">Clientes</h2>

      {/* Espacio superior antes de los cuadros */}
      <div className="mb-6"></div>

      {/* Cuadros de estadísticas */}
      <div className="flex gap-6 mb-6">
        <div className="flex-1 bg-green-100 text-green-800 rounded-lg p-3 text-center shadow-sm">
          <div className="text-lg font-bold">{activeCount}</div>
          <div className="text-xs">Activos</div>
        </div>
        <div className="flex-1 bg-yellow-100 text-yellow-800 rounded-lg p-3 text-center shadow-sm">
          <div className="text-lg font-bold">{pendingCount}</div>
          <div className="text-xs">Pendientes</div>
        </div>
        <div className="flex-1 bg-red-100 text-red-800 rounded-lg p-3 text-center shadow-sm">
          <div className="text-lg font-bold">{cancelledCount}</div>
          <div className="text-xs">Cancelados</div>
        </div>
        <div className="flex-1 bg-gray-100 text-gray-800 rounded-lg p-3 text-center shadow-sm">
          <div className="text-lg font-bold">{totalCount}</div>
          <div className="text-xs">Totales</div>
        </div>
      </div>

      {/* Botón Crear Cliente con espacio abajo */}
<div className="flex justify-end mb-6">
  <button
    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
    onClick={() => setShowCustomersModal(true)}
  >
    Crear Cliente
  </button>
</div>



      {/* Tabla de clientes */}
      <CustomersTable
        customers={customers}
        onEdit={(c) => {
          setSelectedCustomer(c);
          setShowCustomersModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal para crear/editar */}
      {showCustomersModal && (
        <CustomersModal onClose={() => {
          setShowCustomersModal(false);
          setSelectedCustomer(null);
        }}>
          <CustomersForm
            initialData={selectedCustomer}
            onSubmit={selectedCustomer ? handleUpdate : handleCreate}
          />
        </CustomersModal>
      )}
    </div>
  );
}
