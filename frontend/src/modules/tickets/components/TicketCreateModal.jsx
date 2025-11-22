import React, { useEffect, useState } from "react";
import { createTicket, getTicketTypes } from "../services/ticketService";
import { getCustomersForSearch, getZones } from "../../customers/services/customers";

export default function CreateTicketModal({ onClose, onTicketCreated }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [zones, setZones] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    customerSearch: "",
    ticket_type: 0,
    subject: "",
    ticket_address: "",
    problem_description: "",
    zone: "",
  });

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getCustomersForSearch();

        if (data) {
          setCustomers(data);
          setFilteredCustomers(data);
        } else {
          setError("No se pudieron cargar los clientes");
        }
      } catch (err) {
        setError("Error al cargar los clientes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();

    const fetchTicketTypes = async () => {
      try {
        const types = await getTicketTypes();
        setTicketTypes(types);
      } catch (err) {
        console.error("Error al cargar tipos de ticket:", err);
      }
    };
    fetchTicketTypes();

    const fetchZones = async () => {
      try {
        const { data } = await getZones();
        setZones(data);
      } catch (err) {
        console.error("Error al cargar las zonas habilitadas:", err);
      }
    };
    fetchZones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "ticket_type" ? parseInt(value, 10) : value;

    if (name === "ticket_type" && parsedValue === 1) {
      setFormData({
        ...formData,
        [name]: parsedValue,
        customerId: "",
        customerSearch: "",
      });
      setShowCustomerDropdown(false);
    } else {
      setFormData({ ...formData, [name]: parsedValue });
    }
  };

  const handleCustomerSearch = (e) => {
    const searchValue = e.target.value;
    setFormData({ ...formData, customerSearch: searchValue, customerId: "" });

    if (searchValue.trim() === "") {
      setFilteredCustomers([]);
      setShowCustomerDropdown(false);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowCustomerDropdown(true);
    }
  };

  const handleSelectCustomer = (customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customerSearch: customer.name,
      zone: customer.zone
    });
    setShowCustomerDropdown(false);
  };

  const handleClearCustomer = () => {
    setFormData({
      ...formData,
      customerId: "",
      customerSearch: "",
      zone: ""
    });
    setFilteredCustomers(customers);
    setShowCustomerDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmación solo si NO es instalación y el cliente está vacío
    if (formData.ticket_type !== 1 && !formData.customerId && !formData.customerSearch) {
      const confirmWithoutCustomer = window.confirm(
        "⚠️ No has seleccionado ningún cliente.\n\n¿Deseas crear el ticket sin asociarlo a un cliente?"
      );
      if (!confirmWithoutCustomer) {
        return;
      }
    }

    // Validaciones de campos obligatorios
    if (!formData.ticket_type) {
      alert("Por favor selecciona un tipo de ticket");
      return;
    }
    if (!formData.subject.trim()) {
      alert("Por favor ingresa un asunto");
      return;
    }
    if (!formData.problem_description.trim()) {
      alert("Por favor describe el problema");
      return;
    }

    // Validar zona: obligatoria para Instalación, opcional para otros tipos con cliente
    if (formData.ticket_type === 1 && !formData.zone) {
      alert("Por favor selecciona una zona para la instalación");
      return;
    }
    if (formData.ticket_type === 1 && !formData.ticket_address) {
      alert("Por favor selecciona una dirección para la instalación");
      return;
    }
    if (formData.ticket_type !== 1 && formData.customerId && !formData.zone) {
      alert("El cliente seleccionado no tiene zona asignada");
      return;
    }

    try {
      setSaving(true);
      const ticketData = {
        customerId: formData.customerId || null,
        email: null,
        ticket_type_id: formData.ticket_type,
        subject: formData.subject,
        description: formData.problem_description,
        zone: formData.zone || null,
        ticket_address: formData.ticket_address,
      };
      const newTicket = await createTicket(ticketData);
      alert("Ticket creado exitosamente");
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }
      onClose();
    } catch (err) {
      console.error("Error creando ticket:", err);
      alert("Hubo un error al crear el ticket");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg z-50">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl relative">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Crear Nuevo Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Cliente con búsqueda */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cliente {formData.ticket_type === 1 && <span className="text-gray-500">(N/A para instalaciones)</span>}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="customerSearch"
                    value={formData.customerSearch}
                    onChange={handleCustomerSearch}
                    disabled={formData.ticket_type === 1}
                    placeholder={
                      formData.ticket_type === 1
                        ? "No aplica para instalaciones"
                        : "Buscar cliente por nombre o email..."
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    autoComplete="off"
                  />
                  {formData.customerId && formData.ticket_type !== 1 && (
                    <button
                      type="button"
                      onClick={handleClearCustomer}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Dropdown de resultados */}
                {showCustomerDropdown && formData.ticket_type !== 1 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-xs text-gray-500">{customer.email}</div>
                            </div>
                            {customer.zone && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {customer.zone}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">No se encontraron clientes</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Intenta con otro término de búsqueda
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Mostrar cliente seleccionado */}
                {formData.customerId && formData.ticket_type !== 1 && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium text-green-800">
                          Cliente seleccionado
                        </span>
                      </div>
                      {formData.zone && (
                        <span className="text-xs text-green-700">
                          Zona: <strong>{formData.zone}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tipo de Ticket */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de Servicio <span className="text-red-500">*</span>
                </label>
                <select
                  name="ticket_type"
                  value={formData.ticket_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccionar tipo...</option>

                  {ticketTypes.length > 0 ? (
                    ticketTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando tipos...</option>
                  )}
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Asunto<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Instalación "
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Dirección<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ticket_address"
                  value={formData.ticket_address}
                  onChange={handleChange}
                  required
                  placeholder="Calle 10 #20-30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Descripción del Problema */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descripción del Problema <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="problem_description"
                  value={formData.problem_description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe detalladamente el problema o requerimiento del cliente..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Zona */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Zona {formData.ticket_type === 1 && <span className="text-red-500">*</span>}
                  {formData.ticket_type !== 1 && formData.customerId && (
                    <span className="text-gray-500"> (del cliente)</span>
                  )}
                </label>
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  disabled={formData.ticket_type !== 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.ticket_type === 1
                      ? "Seleccionar zona..."
                      : formData.customerId
                        ? "Zona del cliente"
                        : "Selecciona primero un cliente"}
                  </option>

                  {formData.ticket_type === 1 && zones.length > 0 ? (
                    zones.map((zone) => (
                      <option key={zone.name} value={zone.name}>
                        {zone.name}
                      </option>
                    )))
                    : (
                      <option disabled>Cargando zonas...</option>
                    )}
                </select>
                {formData.ticket_type !== 1 && formData.customerId && formData.zone && (
                  <p className="mt-1 text-xs text-gray-500">
                    Zona asignada: <span className="font-medium text-gray-700">{formData.zone}</span>
                  </p>
                )}
              </div>

              {/* Información adicional */}
              <div className={`border rounded-xl p-4 ${formData.ticket_type === 1
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
                }`}>
                <p className={`text-xs ${formData.ticket_type === 1
                  ? "text-yellow-800"
                  : "text-blue-800"
                  }`}>
                  <strong>Nota:</strong> {formData.ticket_type === 1
                    ? "Los tickets de instalación no requieren cliente asociado ya que se trata de nuevas instalaciones. Debes seleccionar manualmente la zona donde se realizará la instalación."
                    : "Para tickets de soporte, mantenimiento y otros servicios, la zona se asigna automáticamente según el cliente seleccionado. El campo cliente es opcional, pero si seleccionas uno, su zona será utilizada."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Creando..." : "Crear Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}