import React from "react";

export default function DashboardContent({
  tickets,
  sortField,
  sortOrder,
  handleSort,
  page,
  totalPages,
  nextPage,
  prevPage,
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tickets</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["id", "subject", "client", "created_at"].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-6 py-3 text-left text-xs font-medium cursor-pointer ${
                    sortField === field ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  {field === "id"
                    ? "ID"
                    : field === "subject"
                    ? "Descripción"
                    : field === "client"
                    ? "Cliente"
                    : "Fecha"}
                  {sortField === field && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length ? (
              tickets.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{t.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {t.subject}
                  </td>
                  <td className="px-6 py-3 text-sm">{t.client}</td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No hay tickets disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={prevPage}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-100 text-sm rounded-lg disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-100 text-sm rounded-lg disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
