import React, { useState } from 'react';

export default function TicketForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    correoCliente: '',
    asunto: '',
    descripcionProblema: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({
      correoCliente: '',
      asunto: '',
      descripcionProblema: ''
    });
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-md h-full max-h-[670px] w-full max-w-[900px] border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reportar Problema</h2>

      {/* Contenedor interno oscuro */}
      <div className=" align-center bg-white-100 pt-1 pr-7 pb-5 pl-7 rounded-2xl ">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
          <input
            type="email"
            value={formData.correoCliente}
            onChange={(e) => setFormData({ ...formData, correoCliente: e.target.value })}
            placeholder="Correo del cliente Titular"
            className="w-full max-w-[645px] h-full max-h-[40px] px-5 py-3 border border-gray-400 rounded-xl outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 text-sm bg-white"
            required
          />
          <input
            type="text"
            value={formData.asunto}
            onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
            placeholder="Asunto"
            className="w-full max-w-[645px] h-full max-h-[40px] px-5 py-3 border border-gray-400 rounded-xl outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 text-sm bg-white"
            required
          />
          <textarea
            value={formData.descripcionProblema}
            onChange={(e) => setFormData({ ...formData, descripcionProblema: e.target.value })}
            placeholder="Descripción del problema..."
            rows={6}
            className="w-full max-w-[645px] h-full max-h-[200px] px-5 py-3 border border-gray-400 rounded-xl outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 text-sm resize-none bg-white"
            required
          />

          <div className="flex gap-4 mt-4 w-full max-w-[645px]">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-5 py-2.5 border border-gray-300 rounded-xl text-white-700 hover:bg-indigo-250 transition-all font-medium text-sm"
            >
              Borrar
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 text-white rounded-xl hover:bg-indigo-250 transition-all font-medium text-sm shadow-md"
            >
              Generar Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
