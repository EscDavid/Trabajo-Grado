import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import TicketModal from "./TicketModal";
import TicketStats from "./TicketStats";


export default function DashboardContent({
  tickets,
  sortField,
  sortOrder,
  handleSort,
  page,
  setPage,
  totalPages,
  perPage,
  setPerPage,
  totalRecords,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Cambiamos a guardar solo el ID
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleTableSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    handleSort(key === "creation" ? "created_at" : key);
  };

  // Ahora solo guardamos el ID y abrimos el modal
  const handleRowDoubleClick = (ticketId) => {
    console.log("✅ ID recibido en handleRowDoubleClick:", ticketId);
    setSelectedTicketId(ticketId);
    setShowModal(true);
  };


  const SortableHeader = ({ label, sortKey }) => (
    <th
      className="px-3 py-1 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleTableSort(sortKey)}
    >
      <div className="flex items-center justify-between w-full">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUp
            size={16}
            className={`-mb-1 ${sortConfig.key === sortKey && sortConfig.direction === "asc"
              ? "text-indigo-600"
              : "text-gray-400"
              }`}
          />
          <ChevronDown
            size={16}
            className={`-mt-1 ${sortConfig.key === sortKey && sortConfig.direction === "desc"
              ? "text-indigo-600"
              : "text-gray-400"
              }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="flex-1 overflow-auto p-4 text-sm relative">
      {/* 🔹 Fondo semi-transparente si hay modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>
      )}

      <div className="mb-4">
        <h2 className="text-xs font-semibold text-gray-800">Tickets</h2>
      </div>

      {/* 🔹 Módulo de Estadísticas de Tickets */}
      <div className="mb-4">
        <TicketStats />
      </div>


      {/* ---------- Tabla de Tickets ---------- */}
      <div className="bg-white rounded-lg shadow-sm relative z-20">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Tickets</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader label="ID" sortKey="id" />
              <SortableHeader label="Estatus" sortKey="status" />
              <SortableHeader label="Cliente" sortKey="customer" />
              <SortableHeader label="Asunto" sortKey="subject" />
              <SortableHeader label="Zona" sortKey="zone" />
              <SortableHeader label="Creación" sortKey="creation" />
            </tr>
          </thead>
          <tbody>
            {tickets.length ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => handleRowDoubleClick(ticket.id)} // ✅ Doble clic para abrir modal
                >
                  <td className="px-3 py-2 text-gray-800">{ticket.id}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-1 py-0.5 rounded-full text-xs font-medium ${ticket.status.toLowerCase().includes("abierto")
                        ? "bg-green-100 text-green-800"
                        : ticket.status.toLowerCase().includes("proceso")
                          ? "bg-yellow-100 text-yellow-800"
                          : ticket.status.toLowerCase().includes("cerrado")
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-800">{ticket.customer}</td>
                  <td className="px-3 py-2 text-gray-600">{ticket.subject}</td>
                  <td className="px-3 py-2 text-gray-600">{ticket.zone}</td>
                  <td className="px-3 py-2 text-gray-600">{ticket.creation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-xs text-gray-400">
                  No hay tickets disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ---------- Paginación y selector ---------- */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Mostrar:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando registros del {(page - 1) * perPage + 1} al{" "}
            {Math.min(page * perPage, totalRecords)} de {totalRecords} registros
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 py-1 border rounded text-sm ${page === p
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 MODAL */}
      {showModal && (
        <TicketModal
          ticketId={selectedTicketId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
