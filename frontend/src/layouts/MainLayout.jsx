import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  BarChart3,
  Package,
  TrendingUp,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // ✅ Para detectar ruta actual

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-21">D</span>
              </div>
              <span className="font-bold text-l">Dabang</span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-3 overflow-y-auto">

          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            to="/"
            active={location.pathname === "/"}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Facturación"
            active={location.pathname.startsWith("/billing")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Administración"
            subtitle="CLIENTES"
            active={location.pathname.startsWith("/admin")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<Package size={20} />}
            label="Equipos"
            active={location.pathname.startsWith("/devices")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<TrendingUp size={20} />}
            label="Mapeo de red"
            active={location.pathname.startsWith("/network")}
            onClick={() => setSidebarOpen(false)}
          />

          {/* ✅ Clientes ahora se ilumina cuando estás en /customers */}
          <SidebarItem
            icon={<Users size={20} />}
            label="Clientes"
            to="/customers"
            active={location.pathname.startsWith("/customers")}
            onClick={() => setSidebarOpen(false)}
          />

          {/* ✅ Tickets ahora se ilumina si estás en /tickets o /tickets/dashboard */}
          <SidebarItem
            icon={<Ticket size={20} />}
            label="Tickets"
            to="/tickets/dashboard"
            active={location.pathname.startsWith("/tickets")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={location.pathname.startsWith("/settings")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<LogOut size={20} />}
            label="Sign Out"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src=""
              alt="User P.Photo"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex-1 leading-tight">
              <div className="text-sm font-medium">Fabian</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header móvil */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={29} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-1xl">Isp Management</span>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto pt-2 pb-4 px-4 lg:pt-2 lg:pb-4 lg:px-4">
          {children}
        </main>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, subtitle, to, active, onClick }) => {
  const content = (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
        active ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className={active ? "text-white" : "text-gray-600"}>{icon}</span>

      <div className="leading-tight">
        <div className="text-sm font-medium">{label}</div>
        {subtitle && (
          <div className={`text-xs ${active ? "text-indigo-200" : "text-gray-500"}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};
