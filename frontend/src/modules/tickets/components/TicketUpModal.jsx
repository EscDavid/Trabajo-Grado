import React, { useEffect, useState } from "react";
import { getTicketById, updateTicket } from "../services/ticketService";
import { useNavigate } from "react-router-dom";


export default function TicketModal({ ticketId, onClose }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTicketById(ticketId);
        if (data) {
          setFormData(data);
        } else {
          setError("No se pudo cargar el ticket");
        }
      } catch (err) {
        setError("Error al cargar el ticket");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("handleChange →", e.target.name, "=", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isClosed = formData?.status === "Cerrado";
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log(formData);
      await updateTicket(formData.id, {
        status: formData.status,
        solution_description: formData.solution_description,
        technicianId: null,
      });
      onClose();
    } catch (err) {
      console.error("Error guardando ticket:", err);
      alert("Hubo un error al guardar los cambios");
    } finally {
      setSaving(false);
    }
    navigate("/tickets/dashboard", { replace: true });

  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg z-50">
        Cargando ticket...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
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
              value={formData.customer}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <input
              type="text"
              value={formData.subject}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <textarea
              value={formData.problem_description}
              readOnly
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm resize-none"
            />

            <input
              type="text"
              value={formData.zone}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />

            <input
              type="text"
              value={formData.technician_name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm"
            />


            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isClosed}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
            >
              <option value="Abierto">Abierto</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Cerrado">Cerrado</option>
            </select>


            <textarea
              name="solution_description"
              value={formData.solution_description}
              onChange={handleChange}
              disabled={isClosed}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none"
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

          {!isClosed && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
