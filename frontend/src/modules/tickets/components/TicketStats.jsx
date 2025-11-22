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

// Skeleton de carga
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
        >
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-[250px] sm:h-[280px] lg:h-[320px] bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function TicketStats({ ticketsByStatus, isLoadingStats }) {
  // Mostrar skeleton si está cargando o no hay datos
  if (isLoadingStats || !ticketsByStatus || ticketsByStatus.length === 0) {
    return <StatsSkeleton />;
  }

  // Nombres y colores definidos en el front
  const labels = ["Abierto", "En Progreso", "Cerrado"];
  const colors = ["#ef4444", "#f59e0b", "#10b981"];

  // Convertir array a formato PieChart
  const chartData = ticketsByStatus.map((value, index) => ({
    name: labels[index],
    value,
    color: colors[index],
  }));

  // Datos de ejemplo para los otros gráficos
  const resolutionTime = {
    actual: 4.5,
    target: 6.0,
    history: [
      { week: "Sem 1", time: 5.2 },
      { week: "Sem 2", time: 4.8 },
      { week: "Sem 3", time: 5.1 },
      { week: "Sem 4", time: 4.5 },
    ],
  };

  const productivity = {
    assigned: 65,
    resolved: 53,
    rate: 81.5,
    history: [
      { month: "Ene", assigned: 58, resolved: 52 },
      { month: "Feb", assigned: 62, resolved: 55 },
      { month: "Mar", assigned: 65, resolved: 53 },
    ],
  };

  const improvement =
    ((resolutionTime.target - resolutionTime.actual) / resolutionTime.target) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* 1. Tickets por Estado */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Tickets por Estado
        </h3>
        <div className="w-full h-[250px] sm:h-[280px] lg:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Tiempo Promedio de Resolución */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">Tiempo Promedio</h3>
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <div>
            <p className="text-xs text-blue-600 font-medium">Actual</p>
            <p className="text-xl font-bold text-blue-700">
              {resolutionTime.actual}<span className="text-xs">h</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-green-600 font-medium">Meta</p>
            <p className="text-xl font-bold text-green-700">
              {resolutionTime.target}<span className="text-xs">h</span>
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

      {/* 3. Productividad */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">Productividad</h3>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <div>
            <p className="text-xs text-blue-600 font-medium">Asignados</p>
            <p className="text-xl font-bold text-blue-700">{productivity.assigned}</p>
          </div>
          <div>
            <p className="text-xs text-green-600 font-medium">Resueltos</p>
            <p className="text-xl font-bold text-green-700">{productivity.resolved}</p>
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium">Tasa</p>
            <p className="text-xl font-bold text-purple-700">{productivity.rate}%</p>
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
              <Bar dataKey="assigned" fill="#3b82f6" name="Asignados" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" name="Resueltos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
