import React, { useEffect, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DashboardContent from "../components/DashboardContent";
import { getTickets } from "../services/ticketService";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Registros por página
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTickets({ sortField, sortOrder, page, perPage });
       // Mapear tickets para la tabla
       const mappedTickets = data.tickets.map(t => ({
        id: t.id,
        client: t.client,  
        subject: t.subject || "Sin asunto",
        status: t.status || "Abierto",
        zone: t.zone || "N/A",
        creation: new Date(t.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));

      setTickets(mappedTickets);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords || (data.tickets?.length || 0));
    };
    fetchData();
  }, [sortField, sortOrder, page, perPage]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1); // Reiniciar página al cambiar sort
  };

  return (
    <MainLayout>
      <DashboardContent
        tickets={tickets}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        totalRecords={totalRecords}
      />
    </MainLayout>
  );
}
