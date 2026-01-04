const BOOKS_BASE_URL = "/api/books"

export const booksApi = {
  getAllBooks: async (token) => {
    const response = await fetch(`${BOOKS_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil data buku")
    const result = await response.json()
    return result.data || result
  },

  getBookById: async (token, id) => {
    const response = await fetch(`${BOOKS_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil detail buku")
    const result = await response.json()
    return result.data || result
  },

  getBooksByGenre: async (token, genre) => {
    const response = await fetch(`${BOOKS_BASE_URL}/genres/${encodeURIComponent(genre)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil buku berdasarkan genre")
    const result = await response.json()
    return result.data || result
  },

  getBooksByYear: async (token, year) => {
    const response = await fetch(`${BOOKS_BASE_URL}/year/${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil buku berdasarkan tahun")
    const result = await response.json()
    return result.data || result
  },

  getBooksByAuthor: async (token, author) => {
    const response = await fetch(`${BOOKS_BASE_URL}/author/${encodeURIComponent(author)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Gagal mengambil buku berdasarkan penulis")
    const result = await response.json()
    return result.data || result
  },
}
