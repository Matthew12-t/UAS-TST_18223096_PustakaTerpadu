import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { booksApi } from "@/services/booksApi"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Search, BookOpen, Filter, X } from "lucide-react"

export default function BooksPage() {
  const { token, booksToken, user } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterValue, setFilterValue] = useState("")
  const [genres, setGenres] = useState([])
  const [years, setYears] = useState([])
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    if (!token || !booksToken) {
      navigate("/login")
      return
    }
    fetchBooks()
  }, [token, booksToken])

  useEffect(() => {
    if (books.length > 0) {
      const uniqueGenres = [...new Set(books.flatMap((b) => b.genres?.split(",").map(g => g.trim()) || []))]
      const uniqueYears = [...new Set(books.map((b) => b.year).filter(Boolean))].sort((a, b) => b - a)
      const uniqueAuthors = [...new Set(books.map((b) => b.authors).filter(Boolean))]
      setGenres(uniqueGenres)
      setYears(uniqueYears)
      setAuthors(uniqueAuthors)
    }
  }, [books])

  useEffect(() => {
    let result = books
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(term) ||
          book.authors?.toLowerCase().includes(term)
      )
    }
    setFilteredBooks(result)
  }, [books, searchTerm])

  useEffect(() => {
    if (filterValue && booksToken) {
      handleFilter()
    }
  }, [filterValue])

  const fetchBooks = async () => {
    if (!booksToken) return
    setLoading(true)
    setError("")
    try {
      const data = await booksApi.getAllBooks(booksToken)
      const booksArray = Array.isArray(data) ? data : []
      setBooks(booksArray)
      setFilteredBooks(booksArray)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    if (!filterValue || !booksToken) {
      fetchBooks()
      return
    }
    setLoading(true)
    setError("")
    try {
      let data
      switch (filterType) {
        case "genre":
          data = await booksApi.getBooksByGenre(booksToken, filterValue)
          break
        case "year":
          data = await booksApi.getBooksByYear(booksToken, filterValue)
          break
        case "author":
          data = await booksApi.getBooksByAuthor(booksToken, filterValue)
          break
        default:
          data = await booksApi.getAllBooks(booksToken)
      }
      const booksArray = Array.isArray(data) ? data : []
      setBooks(booksArray)
      setFilteredBooks(booksArray)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearFilter = () => {
    setFilterType("all")
    setFilterValue("")
    fetchBooks()
  }

  const getFilterOptions = () => {
    switch (filterType) {
      case "genre":
        return genres
      case "year":
        return years
      case "author":
        return authors
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Memuat katalog buku...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Katalog Buku
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul, penulis, atau ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setFilterValue("")
              }}
              className="w-32"
            >
              <option value="all">Semua</option>
              <option value="genre">Genre</option>
              <option value="year">Tahun</option>
              <option value="author">Penulis</option>
            </Select>
            {filterType !== "all" && (
              <>
                <Select
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value)
                  }}
                  className="w-40"
                >
                  <option value="">Pilih {filterType}</option>
                  {getFilterOptions().map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
                <Button onClick={clearFilter} variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Tidak ada buku ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <Card key={book.id || book._id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{book.authors}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  {book.year && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Tahun:</span> {book.year}
                    </p>
                  )}
                  {book.genres && (
                    <div className="flex flex-wrap gap-1">
                      {book.genres.split(",").map((g) => (
                        <Badge key={g.trim()} variant="secondary" className="text-xs">
                          {g.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/books/${book.id || book._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Lihat Detail
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
