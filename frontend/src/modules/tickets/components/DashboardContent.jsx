import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Columns } from "lucide-react";
import TicketModal from "./TicketModal";
import TicketStats from "./TicketStats";

export default function DashboardContent({
  tickets,
  ticketsByStatus,
  isLoading,
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
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isLoadingStats = !tickets || tickets.length === 0;

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    status: true,
    customer: true,
    subject: true,
    zone: true,
    creation: true,
  });

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const columnMenuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (col) =>
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));

  const handleTableSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    handleSort(key === "creation" ? "created_at" : key);
  };

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
            className={`-mb-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "text-indigo-600"
                : "text-gray-400"
            }`}
          />
          <ChevronDown
            size={16}
            className={`-mt-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
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
      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>
      )}

      <div className="mb-4">
        <h2 className="text-xs font-semibold text-gray-800">Tickets</h2>
      </div>
      

      <div className="mb-4">
      <TicketStats   
      ticketsByStatus={ticketsByStatus} isLoading={isLoading} />



      </div>

      <div className="bg-white rounded-lg shadow-sm relative z-20">
        {/* 🔹 Header con botón de columnas */}
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Tickets</h3>

          {/* Botón para seleccionar columnas */}
          <div className="relative" ref={columnMenuRef}>
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Columns size={16} />
              <span>Columnas</span>
            </button>

            {/* Menú desplegable de columnas */}
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-2">
                    Mostrar columnas
                  </div>
                  {[
                    { key: "id", label: "ID" },
                    { key: "status", label: "Estatus" },
                    { key: "customer", label: "Cliente" },
                    { key: "subject", label: "Asunto" },
                    { key: "zone", label: "Zona" },
                    { key: "creation", label: "Creación" },
                  ].map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key]}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {visibleColumns.id && <SortableHeader label="ID" sortKey="id" />}
              {visibleColumns.status && <SortableHeader label="Estatus" sortKey="status" />}
              {visibleColumns.customer && <SortableHeader label="Cliente" sortKey="customer" />}
              {visibleColumns.subject && <SortableHeader label="Asunto" sortKey="subject" />}
              {visibleColumns.zone && <SortableHeader label="Zona" sortKey="zone" />}
              {visibleColumns.creation && <SortableHeader label="Creación" sortKey="creation" />}
            </tr>
          </thead>
          <tbody>
            {tickets.length ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => handleRowDoubleClick(ticket.id)}
                >
                  {visibleColumns.id && <td className="px-3 py-2 text-gray-800">{ticket.id}</td>}
                  {visibleColumns.status && (
                    <td className="px-3 py-2">
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                          ticket.status.toLowerCase().includes("abierto")
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
                  )}
                  {visibleColumns.customer && <td className="px-3 py-2 text-gray-800">{ticket.customer}</td>}
                  {visibleColumns.subject && <td className="px-3 py-2 text-gray-600">{ticket.subject}</td>}
                  {visibleColumns.zone && <td className="px-3 py-2 text-gray-600">{ticket.zone}</td>}
                  {visibleColumns.creation && <td className="px-3 py-2 text-gray-600">{ticket.creation}</td>}
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
            Mostrando los registros {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, totalRecords)} de {totalRecords}.
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>

              {/* 🔹 Paginación con formato 1 | 2 | 3 */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p, index) => (
                  <React.Fragment key={p}>
                    <button
                      onClick={() => setPage(p)}
                      className={`px-2 py-1 rounded transition-all ${
                        page === p
                          ? "font-bold text-indigo-600 scale-110"
                          : "text-gray-600 hover:text-indigo-600"
                      }`}
                    >
                      {p}
                    </button>
                    {index < totalPages - 1 && <span className="text-gray-400">|</span>}
                  </React.Fragment>
                ))}
              </div>

              <button
                className="px-2 py-1 border rounded text-sm hover:bg-gray-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TicketModal
          ticketId={selectedTicketId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}