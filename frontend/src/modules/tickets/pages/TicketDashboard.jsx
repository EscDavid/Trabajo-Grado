import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DashboardContent from "../components/DashboardContent";
import { getTickets } from "../services/ticketService";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const data = await getTickets({ sortField, sortOrder, page, perPage });


    const mappedTickets = data.tickets.map((t) => ({
      id: t.id,
      customer: t.customer,
      subject: t.subject ,
      status: t.status ,
      zone: t.zone ,
      creation: new Date(t.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    setTickets(mappedTickets);
    setTotalPages(data.totalPages || 1);
    setTotalRecords(data.totalRecords || data.tickets.length || 0);

  
 
    setStats(data.stats );

    setIsLoading(false);
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
        ticketsByStatus={stats} 
       // resolutionTime={dashboardStats?.resolutionTime}
        //productivity={dashboardStats?.productivity}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        totalRecords={totalRecords}
        isLoading={isLoading}
        onPerPageChange={fetchData}
      />
    </MainLayout>
  );
}
