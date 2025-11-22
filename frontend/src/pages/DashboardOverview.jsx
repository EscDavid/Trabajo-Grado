import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { customerService } from "../services/customer.service";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaChartLine
} from "react-icons/fa";

export default function DashboardOverview() {
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { active: 0, suspended: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await customerService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Clientes",
      value: stats.total,
      icon: FaUsers,
      color: "bg-blue-500",
      bgLight: "bg-blue-50"
    },
    {
      title: "Clientes Activos",
      value: stats.byStatus?.active || 0,
      icon: FaUserCheck,
      color: "bg-green-500",
      bgLight: "bg-green-50"
    },
    {
      title: "Clientes Suspendidos",
      value: stats.byStatus?.suspended || 0,
      icon: FaUserTimes,
      color: "bg-yellow-500",
      bgLight: "bg-yellow-50"
    },
    {
      title: "Tasa de Retención",
      value: stats.total > 0 
        ? `${Math.round((stats.byStatus?.active || 0) / stats.total * 100)}%`
        : "0%",
      icon: FaChartLine,
      color: "bg-purple-500",
      bgLight: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido, {user?.fullName?.split(" ")[0] || user?.username}!
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Información Rápida
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/administracion"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Administración</p>
              <p className="text-sm text-gray-500">Usuarios y clientes</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}