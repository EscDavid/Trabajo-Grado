import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - ANCHO AMPLIADO A 450px */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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

        {/* Navigation - PADDING AUMENTADO */}
        <nav className="flex-1 px-3 space-y-3 overflow-y-auto">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            to="/"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Facturación"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Administración"
            subtitle="CLTES"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Equipos"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            icon={<TrendingUp size={20} />}
            label="Mapeo de red"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            icon={<Ticket size={20} />}
            label="Tickets"
            to="/tickets"
            active
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
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
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="User"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex-1 leading-tight">
              <div className="text-sm font-medium">Fabian</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>

      </aside>

      {/* Contenido principal */}
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
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="font-bold text-1xl">Dabang</span>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, subtitle, to, active, onClick }) => {
  const content = (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${active
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-50"
        }`}
      onClick={onClick}
    >
      <span className={`${active ? "text-white" : "text-gray-600"}`}>
        {icon}
      </span>

      <div className="leading-tight">
        <div className="text-sm font-medium">{label}</div>
        {subtitle && (
          <div
            className={`text-xs ${active ? "text-indigo-200" : "text-gray-500"
              }`}
          >
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
