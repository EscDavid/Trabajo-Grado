import { useState, useEffect } from "react";
import { userService } from "../services/user.service";
import { customerService } from "../services/customer.service";
import { authService } from "../services/auth.service";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTimes,
  FaCheck,
  FaSpinner
} from "react-icons/fa";

export default function Administration() {
  const currentUser = authService.getCurrentUser();
  
  // ==================== ESTADOS USUARIOS ====================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: "tecnico"
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [submittingUser, setSubmittingUser] = useState(false);

  // ==================== ESTADOS CLIENTES ====================
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState("create");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrimary: "",
    phoneSecondary: "",
    documentType: "cc",
    documentNumber: "",
    billingAddress: "",
    serviceAddress: "",
    notes: ""
  });
  const [customerFormErrors, setCustomerFormErrors] = useState({});
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

  // ==================== ESTADO ALERTAS ====================
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // ==================== EFECTOS ====================
  useEffect(() => {
    loadUsers();
    loadCustomers();
  }, []);

  // ==================== FUNCIONES COMUNES ====================
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // ==================== FUNCIONES USUARIOS ====================
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userService.list({ limit: 50 });
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      showAlert("error", "Error al cargar usuarios");
    } finally {
      setLoadingUsers(false);
    }
  };

  const openUserCreateModal = () => {
    setUserModalMode("create");
    setSelectedUser(null);
    setUserFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      role: "tecnico"
    });
    setUserFormErrors({});
    setShowUserModal(true);
  };

  const openUserEditModal = (user) => {
    setUserModalMode("edit");
    setSelectedUser(user);
    setUserFormData({
      username: user.username,
      password: "",
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: user.role
    });
    setUserFormErrors({});
    setShowUserModal(true);
  };

  const openUserViewModal = (user) => {
    setUserModalMode("view");
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserFormErrors({});
  };

  const validateUserForm = () => {
    const errors = {};

    if (!userFormData.fullName.trim()) {
      errors.fullName = "El nombre completo es requerido";
    }

    if (!userFormData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      errors.email = "Email inválido";
    }

    if (userModalMode === "create") {
      if (!userFormData.username.trim()) {
        errors.username = "El nombre de usuario es requerido";
      }
      if (!userFormData.password) {
        errors.password = "La contraseña es requerida";
      } else if (userFormData.password.length < 6) {
        errors.password = "Mínimo 6 caracteres";
      }
    }

    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    setSubmittingUser(true);
    try {
      let response;
      if (userModalMode === "create") {
        response = await userService.create(userFormData);
      } else {
        const updateData = { ...userFormData };
        if (!updateData.password) delete updateData.password;
        delete updateData.username;
        response = await userService.update(selectedUser.id, updateData);
      }

      if (response.success) {
        showAlert("success", userModalMode === "create" ? "Usuario creado" : "Usuario actualizado");
        closeUserModal();
        loadUsers();
      } else {
        showAlert("error", response.message || "Error al guardar");
      }
    } catch (error) {
      showAlert("error", error.response?.data?.message || "Error al guardar usuario");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleUserStatusChange = async (user) => {
    try {
      const newStatus = !user.isActive;
      const response = await userService.changeStatus(user.id, newStatus);
      if (response.success) {
        showAlert("success", `Usuario ${newStatus ? "activado" : "desactivado"}`);
        loadUsers();
      }
    } catch (error) {
      showAlert("error", "Error al cambiar estado");
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      tecnico: "bg-blue-100 text-blue-700",
      contador: "bg-green-100 text-green-700"
    };
    const labels = {
      admin: "Administrador",
      tecnico: "Técnico",
      contador: "Contador"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role] || "bg-gray-100 text-gray-700"}`}>
        {labels[role] || role}
      </span>
    );
  };

  // ==================== FUNCIONES CLIENTES ====================
  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await customerService.list({ limit: 50 });
      if (response.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
      showAlert("error", "Error al cargar clientes");
    } finally {
      setLoadingCustomers(false);
    }
  };

  const openCustomerCreateModal = () => {
    setCustomerModalMode("create");
    setSelectedCustomer(null);
    setCustomerFormData({
      firstName: "",
      lastName: "",
      email: "",
      phonePrimary: "",
      phoneSecondary: "",
      documentType: "cc",
      documentNumber: "",
      billingAddress: "",
      serviceAddress: "",
      notes: ""
    });
    setCustomerFormErrors({});
    setShowCustomerModal(true);
  };

  const openCustomerEditModal = (customer) => {
    setCustomerModalMode("edit");
    setSelectedCustomer(customer);
    setCustomerFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phonePrimary: customer.phonePrimary || "",
      phoneSecondary: customer.phoneSecondary || "",
      documentType: customer.documentType || "cc",
      documentNumber: customer.documentNumber || "",
      billingAddress: customer.billingAddress || "",
      serviceAddress: customer.serviceAddress || "",
      notes: customer.notes || ""
    });
    setCustomerFormErrors({});
    setShowCustomerModal(true);
  };

  const openCustomerViewModal = (customer) => {
    setCustomerModalMode("view");
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
    setCustomerFormErrors({});
  };

  const validateCustomerForm = () => {
    const errors = {};

    if (!customerFormData.firstName.trim()) {
      errors.firstName = "El nombre es requerido";
    }
    if (!customerFormData.lastName.trim()) {
      errors.lastName = "El apellido es requerido";
    }
    if (!customerFormData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerFormData.email)) {
      errors.email = "Email inválido";
    }
    if (!customerFormData.billingAddress.trim()) {
      errors.billingAddress = "La dirección es requerida";
    }

    setCustomerFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!validateCustomerForm()) return;

    setSubmittingCustomer(true);
    try {
      let response;
      if (customerModalMode === "create") {
        response = await customerService.create(customerFormData);
      } else {
        response = await customerService.update(selectedCustomer.id, customerFormData);
      }

      if (response.success) {
        showAlert("success", customerModalMode === "create" ? "Cliente creado" : "Cliente actualizado");
        closeCustomerModal();
        loadCustomers();
      } else {
        showAlert("error", response.message || "Error al guardar");
      }
    } catch (error) {
      showAlert("error", error.response?.data?.message || "Error al guardar cliente");
    } finally {
      setSubmittingCustomer(false);
    }
  };

  const handleCustomerStatusChange = async (customer) => {
    try {
      const newStatus = customer.status === "active" ? "suspended" : "active";
      const response = await customerService.changeStatus(customer.id, newStatus);
      if (response.success) {
        showAlert("success", `Cliente ${newStatus === "active" ? "activado" : "suspendido"}`);
        loadCustomers();
      }
    } catch (error) {
      showAlert("error", "Error al cambiar estado");
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-8">
      {/* Alert */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {alert.type === "success" ? <FaCheck /> : <FaTimes />}
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ show: false, type: "", message: "" })}>
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== SECCIÓN USUARIOS ==================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <button
            onClick={openUserCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-3 h-3" />
            NUEVO USUARIO
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold text-red-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-red-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-red-500 uppercase tracking-wider">
                  Ingreso
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-red-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-red-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingUsers ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.isActive ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openUserViewModal(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Ver"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openUserEditModal(user)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleUserStatusChange(user)}
                            className={`p-2 rounded-lg ${
                              user.isActive
                                ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                            title={user.isActive ? "Desactivar" : "Activar"}
                          >
                            {user.isActive ? <FaTimes className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== SECCIÓN CLIENTES ==================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Cartera de Clientes</h2>
          <button
            onClick={openCustomerCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-3 h-3" />
            CREAR CLIENTE
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Estado del Servicio
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingCustomers ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      #{String(customer.id).padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{customer.phonePrimary || "-"}</p>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {customer.status === "active" ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openCustomerViewModal(customer)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Ver"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openCustomerEditModal(customer)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Editar"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCustomerStatusChange(customer)}
                          className={`p-2 rounded-lg ${
                            customer.status === "active"
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={customer.status === "active" ? "Suspender" : "Activar"}
                        >
                          {customer.status === "active" ? (
                            <FaTimes className="w-4 h-4" />
                          ) : (
                            <FaCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== MODAL USUARIOS ==================== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeUserModal} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {userModalMode === "create" && "Nuevo Usuario"}
                  {userModalMode === "edit" && "Editar Usuario"}
                  {userModalMode === "view" && "Detalles del Usuario"}
                </h3>
                <button onClick={closeUserModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-4">
                {userModalMode === "view" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(selectedUser?.fullName)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{selectedUser?.fullName}</h4>
                        <p className="text-gray-500">@{selectedUser?.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedUser?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teléfono</p>
                        <p className="font-medium">{selectedUser?.phone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rol</p>
                        {getRoleBadge(selectedUser?.role)}
                      </div>
                      <div>
                        <p className="text-gray-500">Estado</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${selectedUser?.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {selectedUser?.isActive ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha de registro</p>
                        <p className="font-medium">{formatDate(selectedUser?.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Último acceso</p>
                        <p className="font-medium">{formatDate(selectedUser?.lastLoginAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    {userModalMode === "create" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                        <input
                          type="text"
                          value={userFormData.username}
                          onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${userFormErrors.username ? "border-red-500" : "border-gray-200"}`}
                          placeholder="usuario123"
                        />
                        {userFormErrors.username && <p className="text-red-500 text-xs mt-1">{userFormErrors.username}</p>}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input
                        type="text"
                        value={userFormData.fullName}
                        onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${userFormErrors.fullName ? "border-red-500" : "border-gray-200"}`}
                        placeholder="Juan Pérez"
                      />
                      {userFormErrors.fullName && <p className="text-red-500 text-xs mt-1">{userFormErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${userFormErrors.email ? "border-red-500" : "border-gray-200"}`}
                        placeholder="juan@empresa.com"
                      />
                      {userFormErrors.email && <p className="text-red-500 text-xs mt-1">{userFormErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {userModalMode === "create" ? "Contraseña *" : "Nueva contraseña"}
                      </label>
                      <input
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${userFormErrors.password ? "border-red-500" : "border-gray-200"}`}
                        placeholder="••••••••"
                      />
                      {userFormErrors.password && <p className="text-red-500 text-xs mt-1">{userFormErrors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={userFormData.phone}
                        onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="300 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="admin">Administrador</option>
                        <option value="tecnico">Técnico</option>
                        <option value="contador">Contador</option>
                      </select>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={closeUserModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  {userModalMode === "view" ? "Cerrar" : "Cancelar"}
                </button>
                {userModalMode !== "view" && (
                  <button
                    onClick={handleUserSubmit}
                    disabled={submittingUser}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingUser && <FaSpinner className="w-4 h-4 animate-spin" />}
                    {userModalMode === "create" ? "Crear" : "Guardar"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CLIENTES ==================== */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeCustomerModal} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full z-10 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {customerModalMode === "create" && "Nuevo Cliente"}
                  {customerModalMode === "edit" && "Editar Cliente"}
                  {customerModalMode === "view" && "Detalles del Cliente"}
                </h3>
                <button onClick={closeCustomerModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-4">
                {customerModalMode === "view" ? (
                  <div className="space-y-4">
                    <div className="pb-4 border-b">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {selectedCustomer?.firstName} {selectedCustomer?.lastName}
                      </h4>
                      <p className="text-gray-500">
                        {selectedCustomer?.documentType?.toUpperCase()}: {selectedCustomer?.documentNumber || "-"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedCustomer?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teléfono Principal</p>
                        <p className="font-medium">{selectedCustomer?.phonePrimary || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teléfono Secundario</p>
                        <p className="font-medium">{selectedCustomer?.phoneSecondary || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estado</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${selectedCustomer?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {selectedCustomer?.status === "active" ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Dirección de Facturación</p>
                        <p className="font-medium">{selectedCustomer?.billingAddress || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Dirección de Servicio</p>
                        <p className="font-medium">{selectedCustomer?.serviceAddress || "-"}</p>
                      </div>
                      {selectedCustomer?.notes && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Notas</p>
                          <p className="font-medium">{selectedCustomer.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input
                          type="text"
                          value={customerFormData.firstName}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, firstName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${customerFormErrors.firstName ? "border-red-500" : "border-gray-200"}`}
                          placeholder="Juan"
                        />
                        {customerFormErrors.firstName && <p className="text-red-500 text-xs mt-1">{customerFormErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                        <input
                          type="text"
                          value={customerFormData.lastName}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, lastName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${customerFormErrors.lastName ? "border-red-500" : "border-gray-200"}`}
                          placeholder="Pérez"
                        />
                        {customerFormErrors.lastName && <p className="text-red-500 text-xs mt-1">{customerFormErrors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={customerFormData.email}
                        onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${customerFormErrors.email ? "border-red-500" : "border-gray-200"}`}
                        placeholder="cliente@email.com"
                      />
                      {customerFormErrors.email && <p className="text-red-500 text-xs mt-1">{customerFormErrors.email}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal</label>
                        <input
                          type="text"
                          value={customerFormData.phonePrimary}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, phonePrimary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="300 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Secundario</label>
                        <input
                          type="text"
                          value={customerFormData.phoneSecondary}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, phoneSecondary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="300 765 4321"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                        <select
                          value={customerFormData.documentType}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, documentType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="cc">Cédula de Ciudadanía</option>
                          <option value="ce">Cédula de Extranjería</option>
                          <option value="nit">NIT</option>
                          <option value="passport">Pasaporte</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                        <input
                          type="text"
                          value={customerFormData.documentNumber}
                          onChange={(e) => setCustomerFormData({ ...customerFormData, documentNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1234567890"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Facturación *</label>
                      <textarea
                        value={customerFormData.billingAddress}
                        onChange={(e) => setCustomerFormData({ ...customerFormData, billingAddress: e.target.value })}
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${customerFormErrors.billingAddress ? "border-red-500" : "border-gray-200"}`}
                        placeholder="Calle 123 #45-67, Barrio, Ciudad"
                      />
                      {customerFormErrors.billingAddress && <p className="text-red-500 text-xs mt-1">{customerFormErrors.billingAddress}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Servicio</label>
                      <textarea
                        value={customerFormData.serviceAddress}
                        onChange={(e) => setCustomerFormData({ ...customerFormData, serviceAddress: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Misma o diferente dirección"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                      <textarea
                        value={customerFormData.notes}
                        onChange={(e) => setCustomerFormData({ ...customerFormData, notes: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Notas adicionales..."
                      />
                    </div>
                  </form>
                )}
              </div>

              <div className="sticky bottom-0 bg-white flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={closeCustomerModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  {customerModalMode === "view" ? "Cerrar" : "Cancelar"}
                </button>
                {customerModalMode !== "view" && (
                  <button
                    onClick={handleCustomerSubmit}
                    disabled={submittingCustomer}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingCustomer && <FaSpinner className="w-4 h-4 animate-spin" />}
                    {customerModalMode === "create" ? "Crear" : "Guardar"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}