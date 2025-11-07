import React, { useState } from "react";
import TicketForm from "./TicketForm";

export default function TicketWrapper() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (formData) => {
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear el ticket");
      const data = await res.json();
      setStatus("success");
      setMessage(`Ticket creado con ID: ${data.ticketId}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "Error al crear el ticket");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      {status === "success" ? (
        <div className="text-center">
          <p className="text-green-600 font-medium">{message}</p>
        </div>
      ) : (
        <TicketForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
