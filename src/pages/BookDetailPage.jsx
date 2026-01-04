import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { booksApi } from "@/services/booksApi"
import { loanApi } from "@/services/loanApi"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, BookOpen, Calendar, User, BookMarked } from "lucide-react"

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token, booksToken } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!token || !booksToken) {
      navigate("/login")
      return
    }
    fetchBookDetail()
  }, [id, token, booksToken])

  const fetchBookDetail = async () => {
    if (!booksToken) return
    setLoading(true)
    setError("")
    try {
      const data = await booksApi.getBookById(booksToken, id)
      setBook(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBorrow = async () => {
    if (!user || !token) {
      navigate("/login")
      return
    }
    setBorrowing(true)
    setError("")
    setSuccess("")
    try {
      await loanApi.createLoan(token, id, user.id)
      setSuccess("Buku berhasil dipinjam! Silakan cek halaman denda untuk melihat peminjaman Anda.")
    } catch (err) {
      setError(err.message)
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Memuat detail buku...</span>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Katalog
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{book?.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {book?.genres &&
                  book.genres.split(",").map((g) => (
                    <Badge key={g.trim()} variant="secondary">
                      {g.trim()}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Penulis</p>
                <p className="font-medium">{book?.authors || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tahun Terbit</p>
                <p className="font-medium">{book?.year || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookMarked className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">ID Buku</p>
                <p className="font-medium">{book?.id || "-"}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-800 p-4 rounded-md">
              {success}
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleBorrow} disabled={borrowing || !!success} className="flex-1">
              {borrowing ? (
                <>
                  <Spinner className="mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <BookMarked className="mr-2 h-4 w-4" />
                  {user ? "Pinjam Buku" : "Login untuk Meminjam"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
