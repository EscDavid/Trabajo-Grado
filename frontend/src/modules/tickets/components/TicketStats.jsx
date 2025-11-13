import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Clock, TrendingUp } from "lucide-react";

// 🎯 Datos simulados temporalmente (puedes conectar luego al backend)
const mockData = {
  ticketsByStatus: [
    { name: "Abierto", value: 12, color: "#ef4444" },
    { name: "En Progreso", value: 8, color: "#f59e0b" },
    { name: "Cerrado", value: 45, color: "#10b981" },
  ],
  resolutionTime: {
    actual: 4.5,
    target: 6.0,
    history: [
      { week: "Sem 1", time: 5.2 },
      { week: "Sem 2", time: 4.8 },
      { week: "Sem 3", time: 5.1 },
      { week: "Sem 4", time: 4.5 },
    ],
  },
  productivity: {
    assigned: 65,
    resolved: 53,
    rate: 81.5,
    history: [
      { month: "Ene", assigned: 58, resolved: 52 },
      { month: "Feb", assigned: 62, resolved: 55 },
      { month: "Mar", assigned: 65, resolved: 53 },
    ],
  },
};

export default function TicketStats() {
  const { ticketsByStatus, resolutionTime, productivity } = mockData;
  const improvement =
    ((resolutionTime.target - resolutionTime.actual) /
      resolutionTime.target) *
    100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* 🟢 1. Tickets por Estado */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Tickets por Estado
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketsByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name, value }) => `${name} (${value})`}
              >
                {ticketsByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🕒 2. Tiempo Promedio de Resolución */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">
            Tiempo Promedio
          </h3>
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <div>
            <p className="text-xs text-blue-600 font-medium">Actual</p>
            <p className="text-xl font-bold text-blue-700">
              {resolutionTime.actual}
              <span className="text-xs">h</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-green-600 font-medium">Meta</p>
            <p className="text-xl font-bold text-green-700">
              {resolutionTime.target}
              <span className="text-xs">h</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium">Mejora</p>
            <p className="text-xl font-bold text-purple-700">
              {improvement.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={resolutionTime.history}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="time"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 3. Productividad */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">
            Productividad
          </h3>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <div>
            <p className="text-xs text-blue-600 font-medium">Asignados</p>
            <p className="text-xl font-bold text-blue-700">
              {productivity.assigned}
            </p>
          </div>
          <div>
            <p className="text-xs text-green-600 font-medium">Resueltos</p>
            <p className="text-xl font-bold text-green-700">
              {productivity.resolved}
            </p>
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium">Tasa</p>
            <p className="text-xl font-bold text-purple-700">
              {productivity.rate}%
            </p>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivity.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="assigned"
                fill="#3b82f6"
                name="Asignados"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="resolved"
                fill="#10b981"
                name="Resueltos"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
