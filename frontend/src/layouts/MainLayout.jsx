import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Grid,
  BarChart3,
  Package,
  TrendingUp,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 text-[15px]">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl">Dabang</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<Home size={20} />} label="Inicio" to="/" />
          <SidebarItem icon={<Ticket size={20} />} label="Tickets" to="/tickets" active />
          <SidebarItem icon={<Package size={20} />} label="Equipos" />
          <SidebarItem icon={<BarChart3 size={20} />} label="Reportes" />
          <SidebarItem icon={<Settings size={20} />} label="Configuración" />
          <SidebarItem icon={<LogOut size={20} />} label="Salir" />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Fabian</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

const SidebarItem = ({ icon, label, to, active }) => (
  <Link
    to={to || "#"}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-indigo-600 text-white"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);
