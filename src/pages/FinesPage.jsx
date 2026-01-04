import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { loanApi } from "@/services/loanApi"
import { booksApi } from "@/services/booksApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, DollarSign, BookOpen } from "lucide-react"

export default function FinesPage() {
  const { user, token, booksToken } = useAuth()
  const [fines, setFines] = useState(null)
  const [booksMap, setBooksMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && token && booksToken) {
      fetchFines()
    }
  }, [user, token, booksToken])

  const fetchFines = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await loanApi.getUserFines(token, user.id)
      setFines(data)
      
      if (data.breakdown && data.breakdown.length > 0) {
        const bookIds = [...new Set(data.breakdown.map(item => item.bookId))]
        const booksData = {}
        for (const bookId of bookIds) {
          try {
            const book = await booksApi.getBookById(booksToken, bookId)
            booksData[bookId] = book
          } catch {
            booksData[bookId] = null
          }
        }
        setBooksMap(booksData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Memuat data denda dan pinjaman...</span>
      </div>
    )
  }

  const totalFine = fines?.totalFine || 0
  const finePerDay = fines?.finePerDay || 1000
  const breakdown = fines?.breakdown || []
  const activeLoans = breakdown.filter(item => !item.returnedAt)
  const returnedLoans = breakdown.filter(item => item.returnedAt)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <AlertTriangle className="h-8 w-8 text-primary" />
        Denda & Pinjaman Saya
      </h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Denda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-destructive" />
              <span className={`text-3xl font-bold ${totalFine > 0 ? "text-destructive" : "text-green-600"}`}>
                {formatCurrency(totalFine)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Denda per hari: {formatCurrency(finePerDay)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pinjaman Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{activeLoans.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">buku belum dikembalikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-secondary" />
              <span className="text-3xl font-bold">{breakdown.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">seluruh riwayat</p>
          </CardContent>
        </Card>
      </div>

      {activeLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pinjaman Aktif ({activeLoans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pinjaman</TableHead>
                  <TableHead>Buku</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Keterlambatan</TableHead>
                  <TableHead>Denda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLoans.map((item) => (
                  <TableRow key={item.loanId}>
                    <TableCell className="font-mono text-xs">{item.loanId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booksMap[item.bookId]?.title || `Book ID: ${item.bookId}`}</p>
                        <p className="text-sm text-muted-foreground">{booksMap[item.bookId]?.authors || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={item.lateDays > 0 ? "text-destructive font-medium" : ""}>
                        {formatDate(item.dueAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.lateDays > 0 ? (
                        <Badge variant="destructive">{item.lateDays} hari</Badge>
                      ) : (
                        <Badge variant="success">Tepat waktu</Badge>
                      )}
                    </TableCell>
                    <TableCell className={item.fine > 0 ? "text-destructive font-medium" : ""}>
                      {formatCurrency(item.fine)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {returnedLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pinjaman ({returnedLoans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pinjaman</TableHead>
                  <TableHead>Buku</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Dikembalikan</TableHead>
                  <TableHead>Keterlambatan</TableHead>
                  <TableHead>Denda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnedLoans.map((item) => (
                  <TableRow key={item.loanId}>
                    <TableCell className="font-mono text-xs">{item.loanId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booksMap[item.bookId]?.title || `Book ID: ${item.bookId}`}</p>
                        <p className="text-sm text-muted-foreground">{booksMap[item.bookId]?.authors || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.dueAt)}</TableCell>
                    <TableCell>{formatDate(item.returnedAt)}</TableCell>
                    <TableCell>
                      {item.lateDays > 0 ? (
                        <Badge variant="warning">{item.lateDays} hari</Badge>
                      ) : (
                        <Badge variant="success">Tepat waktu</Badge>
                      )}
                    </TableCell>
                    <TableCell className={item.fine > 0 ? "text-destructive font-medium" : ""}>
                      {formatCurrency(item.fine)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {breakdown.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Anda belum memiliki riwayat peminjaman.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
