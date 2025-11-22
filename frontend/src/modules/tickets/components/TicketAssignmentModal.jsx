import React, { useEffect, useState } from "react";
import { assignTicket } from "../services/ticketService";
import { getTechnicians } from "../services/userService";
import { X } from "lucide-react";

export default function TicketAssignmentModal({ ticketIds, onClose, onSuccess }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const data = await getTechnicians();
        setTechnicians(data || []);
      } catch (err) {
        setError("Error cargando técnicos");
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, []);

  const filteredTechs = technicians.filter((t) =>
    t.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeChip = (id) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleConfirm = async () => {
    if (selected.length === 0) return alert("Selecciona al menos un técnico");

    if (!window.confirm(`Asignar ${selected.length} técnico(s)?`)) return;

    try {
      setSaving(true);

      await Promise.all(
        ticketIds.map((tId) =>
          assignTicket(tId, { technicianIds: selected })
        )
      );

      alert("Técnicos asignados correctamente");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Error asignando técnicos");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xl z-50">
        Cargando...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Asignar Técnico(s)</h2>
            <p className="text-xs text-gray-500 mt-1">
              {ticketIds.length} ticket(s) seleccionado(s)
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          {/* SEARCHABLE DROPDOWN */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Seleccionar técnicos</label>
            
            <div
              className="mt-1 border rounded-lg px-3 py-2 hover:border-indigo-400 cursor-pointer bg-gray-50"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-gray-600 text-sm">
                {selected.length > 0
                  ? `${selected.length} técnico(s) seleccionados`
                  : "Haz clic para seleccionar"}
              </span>
            </div>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute z-40 bg-white shadow-lg border rounded-lg w-full mt-2 max-h-56 overflow-y-auto">
                <input
                  className="w-full px-3 py-2 border-b text-sm outline-none"
                  placeholder="Buscar técnico..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {filteredTechs.length === 0 && (
                  <p className="text-gray-400 p-3 text-center text-sm">
                    No encontrado
                  </p>
                )}

                {filteredTechs.map((tech) => (
                  <label
                    key={tech.id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(tech.id)}
                      onChange={() => toggleSelect(tech.id)}
                    />
                    <span className="text-sm text-gray-700">{tech.full_name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED TECH CHIPS */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => {
                const t = technicians.find((x) => x.id === id);
                return (
                  <div
                    key={id}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-2 text-xs"
                  >
                    {t?.full_name}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removeChip(id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border rounded-xl text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={selected.length === 0 || saving}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? "Asignando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
