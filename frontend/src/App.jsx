import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import Administration from "./pages/Administration";
import { authService } from "./services/auth.service";

function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Vista inicial del dashboard */}
          <Route index element={<DashboardOverview />} />
          
          {/* Administración (Usuarios + Clientes) */}
          <Route path="administracion" element={<Administration />} />
          
          {/* Rutas placeholder para futuras funcionalidades */}
          <Route path="facturacion" element={<PlaceholderPage title="Facturación" />} />
          <Route path="clientes" element={<Administration />} />
          <Route path="red" element={<PlaceholderPage title="Mapeo de Red" />} />
          <Route path="tickets" element={<PlaceholderPage title="Tickets" />} />
          <Route path="settings" element={<PlaceholderPage title="Configuración" />} />
        </Route>
        
        {/* Redirecciones */}
        <Route 
          path="/" 
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="*" 
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

// Componente placeholder para páginas en desarrollo
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500">Esta sección estará disponible próximamente</p>
    </div>
  );
}