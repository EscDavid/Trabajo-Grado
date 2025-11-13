import "../index.css";

export default function CustomersDetailsModal({ customer, onClose }) {
  if (!customer) return null;

  console.log("📦 Datos del cliente recibido:", customer); // ← Verás aquí los nombres reales

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.45)]">
      <div className="bg-white max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">

        {/* Botón cerrar */}
        <button
          className="absolute right-4 top-4 text-xl font-semibold text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Detalles del Cliente
        </h2>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-2 gap-3">
          <Detail label="ID" value={customer.id} />
          <Detail label="Nombre" value={`${customer.first_name} ${customer.last_name}`} />

          <Detail label="Email" value={customer.email} />
          <Detail label="Teléfono Principal" value={customer.phone_primary} />

          <Detail label="Teléfono Secundario" value={customer.phone_secondary} />
          <Detail label="Tipo Documento" value={customer.document_type} />

          <Detail label="Número Documento" value={customer.document_number} />
          <Detail label="Dirección Facturación" value={customer.billing_address} />

          <Detail label="Dirección Servicio" value={customer.service_address} />
          <Detail label="Estado" value={customer.status} />

          <Detail label="Fecha Registro" value={formatDate(customer.registration_date)} />

          {/* ✅ Manejo automático para cualquier nombre de campos de fecha */}
          <Detail
            label="Creado"
            value={formatDate(customer.created_at || customer.createdAt || customer.created)}
          />
          <Detail
            label="Actualizado"
            value={formatDate(customer.updated_at || customer.updatedAt || customer.updated)}
          />

          <Detail label="Usuario (Portal)" value={customer.user_id} />
        </div>

        {/* Notas en ancho completo */}
        <div className="mt-4">
          <Detail label="Notas" value={customer.notes} full />
        </div>

      </div>
    </div>
  );
}

/* COMPONENTE DE CAMPO */
const Detail = ({ label, value, full }) => (
  <div
    className={`${
      full ? "col-span-2" : ""
    } border rounded-md p-3 bg-gray-50 shadow-sm`}
  >
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-sm text-gray-800 mt-1 break-words">{value || "—"}</p>
  </div>
);

/* FORMATEO DE FECHA */
const formatDate = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
};
