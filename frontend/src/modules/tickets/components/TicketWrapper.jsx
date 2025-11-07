// src/modules/tickets/components/TicketWrapper.jsx

import React, { useState } from "react";
import TicketForm from "./TicketForm";
import { createTicket } from "../services/ticketService";


export default function TicketWrapper() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (formData) => {
    setStatus("loading");
    try {
      const result = await createTicket(formData);
      setStatus("success");
      setMessage(`✅ Ticket creado correctamente. ID: ${result.ticketId}`);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "❌ Error al crear el ticket");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6">
        {status === "success" ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">{message}</p>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Crear otro ticket
            </button>
          </div>
        ) : (
          <TicketForm onSubmit={handleFormSubmit} loading={status === "loading"} />
        )}
      </div>

      {status === "error" && (
        <p className="text-red-600 mt-4 font-medium">{message}</p>
      )}
    </div>
  );
}
