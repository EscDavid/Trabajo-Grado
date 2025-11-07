const API_URL = "http://localhost:5000/tickets/dashboard";

export const getTickets = async ({
  sortField = "created_at",
  sortOrder = "asc",
  page = 1,
  limit = 20,
}) => {
  try {
    const res = await fetch(
      `${API_URL}?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Error al obtener tickets");
    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    return { tickets: [], totalPages: 1 };
  }
};
