import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Frontend React Vite MVP ISP</h1>
      <p className="text-gray-600 mb-6">Versión base del sistema</p>
      <Link
        to="/tickets"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Ir al Dashboard de Tickets
      </Link>
    </div>
  );
}
