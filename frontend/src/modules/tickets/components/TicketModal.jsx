import React, { useEffect, useState } from "react";
import { getTicketById } from "../services/ticketService";

export default function TicketModal({ ticketId, onClose }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      const data = await getTicketById(ticketId);
      if (data) setFormData(data);
      setLoading(false);
    };
    fetchTicket();
  }, [ticketId]);

  if (loading || !formData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg z-50">
        Cargando ticket...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl relative">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket #{formData.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-4">
            <input
              type="text"
              value={formData.client_name || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <input
              type="text"
              value={formData.subject || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <textarea
              value={formData.problem_description || ""}
              readOnly
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm resize-none"
            />

            <input
              type="text"
              value={formData.zone || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <input
              type="text"
              value={formData.technician_name || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <select
              value={formData.status || "Abierto"}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            >
              <option>Abierto</option>
              <option>En Proceso</option>
              <option>Cerrado</option>
            </select>

            <textarea
              value={formData.solution_description || ""}
              readOnly
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm resize-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.created_at?.split("T")[0] || ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
              />
              <input
                type="date"
                value={formData.closed_at?.split("T")[0] || ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

