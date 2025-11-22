import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import {
  FaHome,
  FaUsers,
  FaUsersCog,
  FaFileInvoiceDollar,
  FaNetworkWired,
  FaTicketAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  // Obtener iniciales del usuario
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const NavItem = ({ to, icon: Icon, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
          isActive
            ? "bg-blue-600 text-white font-medium"
            : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            D
          </div>
          <span className="text-white text-lg font-semibold">Dabang</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={FaHome} end>
            Dashboard
          </NavItem>
          <NavItem to="/dashboard/facturacion" icon={FaFileInvoiceDollar}>
            Facturación
          </NavItem>

          {/* Admin Section */}
          <div className="pt-4">
            <button
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300"
            >
              <span>Administración</span>
              {adminMenuOpen ? (
                <FaChevronUp className="w-3 h-3" />
              ) : (
                <FaChevronDown className="w-3 h-3" />
              )}
            </button>

            {adminMenuOpen && (
              <div className="mt-1 space-y-1">
                <NavItem to="/dashboard/administracion" icon={FaUsersCog}>
                  Gestión de Usuarios
                </NavItem>
                <NavItem to="/dashboard/clientes" icon={FaUsers}>
                  Gestión de Clientes
                </NavItem>
                <NavItem to="/dashboard/red" icon={FaNetworkWired}>
                  Mapeo de red
                </NavItem>
              </div>
            )}
          </div>

          {/* Tickets */}
          <div className="pt-4">
            <NavItem to="/dashboard/tickets" icon={FaTicketAlt}>
              Tickets
            </NavItem>
            <NavItem to="/dashboard/settings" icon={FaCog}>
              Settings
            </NavItem>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {getInitials(user?.fullName || user?.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role === "admin" ? "Admin" : user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full mt-3 px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}