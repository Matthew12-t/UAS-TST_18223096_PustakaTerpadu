const LOAN_BASE_URL = "/api/loan"

export const loanApi = {
  login: async (userId, role) => {
    const response = await fetch(`${LOAN_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Login gagal")
    }
    return response.json()
  },

  createLoan: async (token, bookId, userId) => {
    const response = await fetch(`${LOAN_BASE_URL}/loan/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId: parseInt(bookId), userId }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Gagal membuat peminjaman")
    }
    return response.json()
  },

  getUserFines: async (token, userId) => {
    const response = await fetch(`${LOAN_BASE_URL}/loan/fines/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil data denda")
    return response.json()
  },

  returnBook: async (token, loanId) => {
    const response = await fetch(`${LOAN_BASE_URL}/loan/return`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ loanId }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Gagal mengembalikan buku")
    }
    return response.json()
  },
}
