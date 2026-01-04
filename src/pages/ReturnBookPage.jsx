import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { loanApi } from "@/services/loanApi"
import { booksApi } from "@/services/booksApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RotateCcw, Search, CheckCircle, User } from "lucide-react"

export default function ReturnBookPage() {
  const { token, booksToken } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [returning, setReturning] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchUserId, setSearchUserId] = useState("")
  const [searchedUserId, setSearchedUserId] = useState("")

  const fetchUserLoans = async () => {
    if (!searchUserId.trim()) {
      setError("Masukkan User ID untuk mencari pinjaman")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const finesData = await loanApi.getUserFines(token, searchUserId.trim())
      const breakdown = finesData.breakdown || []
      const activeLoans = breakdown.filter((l) => !l.returnedAt)
      
      const loansWithBooks = await Promise.all(
        activeLoans.map(async (loan) => {
          try {
            const bookData = await booksApi.getBookById(booksToken, loan.bookId)
            return { ...loan, book: bookData }
          } catch {
            return { ...loan, book: null }
          }
        })
      )
      setLoans(loansWithBooks)
      setSearchedUserId(searchUserId.trim())
    } catch (err) {
      setError(err.message || "User tidak ditemukan atau tidak memiliki pinjaman")
      setLoans([])
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId) => {
    setReturning(loanId)
    setError("")
    setSuccess("")
    try {
      await loanApi.returnBook(token, loanId)
      setSuccess("Buku berhasil dikembalikan!")
      // Refresh loans for this user
      fetchUserLoans()
    } catch (err) {
      setError(err.message)
    } finally {
      setReturning(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <RotateCcw className="h-8 w-8 text-primary" />
        Pengembalian Buku
      </h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Cari Pinjaman Pengguna
          </CardTitle>
          <CardDescription>
            Masukkan User ID (contoh: U001, U002) untuk melihat pinjaman aktif
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Contoh: U001"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && fetchUserLoans()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchUserLoans} disabled={loading}>
                {loading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Cari
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchedUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Pinjaman Aktif - {searchedUserId}</CardTitle>
          </CardHeader>
          <CardContent>
            {loans.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada pinjaman aktif untuk pengguna ini
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Buku</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Keterlambatan</TableHead>
                    <TableHead>Denda</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.loanId}>
                      <TableCell className="font-mono text-sm">{loan.loanId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.book?.title || `Book ID: ${loan.bookId}`}</p>
                          <p className="text-sm text-muted-foreground">{loan.book?.authors || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={loan.lateDays > 0 ? "text-destructive font-medium" : ""}>
                          {formatDate(loan.dueAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {loan.lateDays > 0 ? (
                          <Badge variant="destructive">{loan.lateDays} hari</Badge>
                        ) : (
                          <Badge variant="default">Tepat waktu</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={loan.fine > 0 ? "text-destructive font-medium" : "text-green-600"}>
                          {formatCurrency(loan.fine)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleReturn(loan.loanId)}
                          disabled={returning === loan.loanId}
                        >
                          {returning === loan.loanId ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Kembalikan
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
