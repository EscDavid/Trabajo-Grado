import React, { useEffect, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DashboardContent from "../components/DashboardContent";
import { getTickets } from "../services/ticketService";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTickets({ sortField, sortOrder, page });
      setTickets(data.tickets || data);
      setTotalPages(data.totalPages || 1);
    };
    fetchData();
  }, [sortField, sortOrder, page]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <MainLayout>
      <DashboardContent
        tickets={tickets}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
    </MainLayout>
  );
}
