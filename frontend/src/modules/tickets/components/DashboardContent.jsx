import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function DashboardContent({
  tickets,
  sortField,
  sortOrder,
  handleSort,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleTableSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    // También actualizar el sortField y sortOrder para la API
    if (key === "status") handleSort("status");
    else if (key === "client") handleSort("client");
    else if (key === "zone") handleSort("zone");
    else if (key === "creation") handleSort("created_at");
    else if (key === "subject") handleSort("subject");
  };

  const SortableHeader = ({ label, sortKey }) => (
    <th
      className="px-6 py-3 text-left text-2xl font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleTableSort(sortKey)}
    >
      <div className="flex items-center justify-between w-full">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUp
            size={33}
            className={`-mb-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "text-indigo-900"
                : "text-gray-400"
            }`}
          />
          <ChevronDown
            size={33}
            className={`-mt-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "text-indigo-900"
                : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </th>
  );

  // Mapear los datos de la API al formato esperado
  const mappedTickets = tickets.map((t) => ({
    id: t.id,
    status: t.status || "Abierto",
    client: t.client || "N/A",
    zone: "Norte", // Por defecto, puedes agregar esto a la API
    creation: new Date(t.created_at).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    subject: t.subject || "Sin asunto",
  }));

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TicketsBySectorChart />
          <MonthlyComparisonChart />
        </div>

        <TicketsTable
          tickets={mappedTickets}
          SortableHeader={SortableHeader}
        />
      </div>
    </div>
  );
}

// Tickets Table Component
function TicketsTable({ tickets, SortableHeader }) {
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("abierto") || statusLower === "abierto") {
      return "bg-green-100 text-green-800";
    } else if (
      statusLower.includes("proceso") ||
      statusLower.includes("en proceso")
    ) {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower.includes("cerrado")) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Tickets</h2>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <SortableHeader label="Estatus" sortKey="status" />
            <SortableHeader label="Cliente" sortKey="client" />
            <SortableHeader label="Zona" sortKey="zone" />
            <SortableHeader label="Creación" sortKey="creation" />
            <SortableHeader label="Asunto" sortKey="subject" />
          </tr>
        </thead>
        <tbody>
          {tickets.length ? (
            tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {ticket.client}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ticket.zone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ticket.creation}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ticket.subject}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center py-8 text-sm text-gray-400"
              >
                No hay tickets disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Tickets By Sector Chart
function TicketsBySectorChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-6">Tickets por sector</h3>
      <div className="relative" style={{ height: "250px" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="200"
            x2="400"
            y2="200"
            stroke="#f0f0f0"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="150"
            x2="400"
            y2="150"
            stroke="#f0f0f0"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="100"
            x2="400"
            y2="100"
            stroke="#f0f0f0"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="50"
            x2="400"
            y2="50"
            stroke="#f0f0f0"
            strokeWidth="1"
          />

          <polyline
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            points="0,120 50,100 100,130 150,80 200,110 250,100 300,120 350,100 400,110"
          />

          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            points="0,110 50,90 100,120 150,70 200,100 250,90 300,110 350,130 400,160"
          />

          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points="0,130 50,110 100,140 150,90 200,120 250,110 300,130 350,110 400,120"
          />
        </svg>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mie</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sab</span>
          <span>Dom</span>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mie</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sab</span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-gray-600">A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600">B</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">C</span>
        </div>
      </div>
    </div>
  );
}

// Monthly Comparison Chart
function MonthlyComparisonChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-6">Comparación mensual</h3>
      <div className="relative" style={{ height: "250px" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="blueGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polygon
            fill="url(#blueGradient)"
            points="0,250 0,140 50,130 100,150 150,135 200,145 250,140 300,130 350,145 400,135 400,250"
          />

          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points="0,140 50,130 100,150 150,135 200,145 250,140 300,130 350,145 400,135"
          />

          <defs>
            <linearGradient
              id="cyanGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polygon
            fill="url(#cyanGradient)"
            points="0,250 0,80 50,95 100,85 150,100 200,90 250,95 300,105 350,85 400,75 400,250"
          />

          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            points="0,80 50,95 100,85 150,100 200,90 250,95 300,105 350,85 400,75"
          />

          <circle cx="100" cy="150" r="4" fill="#3b82f6" />
          <circle cx="200" cy="145" r="4" fill="#3b82f6" />
          <circle cx="300" cy="130" r="4" fill="#3b82f6" />
          <circle cx="400" cy="135" r="4" fill="#3b82f6" />

          <circle cx="100" cy="85" r="4" fill="#22d3ee" />
          <circle cx="200" cy="90" r="4" fill="#22d3ee" />
          <circle cx="300" cy="105" r="4" fill="#22d3ee" />
          <circle cx="400" cy="75" r="4" fill="#22d3ee" />
        </svg>
      </div>

      <div className="flex items-center justify-center gap-12 mt-6">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Año pasado</span>
          </div>
          <div className="text-2xl font-bold">200</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-xs text-gray-600">Este mes</span>
          </div>
          <div className="text-2xl font-bold">220</div>
        </div>
      </div>
    </div>
  );
}
