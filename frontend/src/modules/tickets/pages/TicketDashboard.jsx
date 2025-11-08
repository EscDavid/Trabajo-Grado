import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DashboardContent from "../components/DashboardContent";
import { getTickets } from "../services/ticketService";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = useCallback(async () => {
    const data = await getTickets({ sortField, sortOrder, page, perPage });
    const mappedTickets = data.tickets.map((t) => ({
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
    setTotalRecords(data.totalRecords || data.tickets.length || 0);
  }, [sortField, sortOrder, page, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
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
        onPerPageChange={fetchData} // ✅ ahora recarga automáticamente
      />
    </MainLayout>
  );
}
