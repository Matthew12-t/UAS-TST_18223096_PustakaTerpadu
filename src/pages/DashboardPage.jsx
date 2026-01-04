import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { loanApi } from "@/services/loanApi"
import { booksApi } from "@/services/booksApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { BookOpen, Clock, AlertTriangle, ArrowRight, Library } from "lucide-react"

export default function DashboardPage() {
  const { user, token, booksToken } = useAuth()
  const [stats, setStats] = useState({
    activeLoans: 0,
    overdueLoans: 0,
    totalFines: 0,
  })
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token && booksToken) {
      fetchDashboardData()
    }
  }, [user, token, booksToken])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const finesData = await loanApi.getUserFines(token, user.id)
      const breakdown = finesData.breakdown || []
      const activeLoans = breakdown.filter((l) => !l.returnedAt)
      const overdueLoans = activeLoans.filter((l) => l.lateDays > 0)
      
      setStats({
        activeLoans: activeLoans.length,
        overdueLoans: overdueLoans.length,
        totalFines: finesData.totalFine || 0,
      })
      
      const recentWithBooks = await Promise.all(
        activeLoans.slice(0, 3).map(async (loan) => {
          try {
            const bookData = await booksApi.getBookById(booksToken, loan.bookId)
            return { ...loan, book: bookData }
          } catch {
            return { ...loan, book: null }
          }
        })
      )
      setRecentLoans(recentWithBooks)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Memuat dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="PustakaTerpadu" className="h-12 w-auto" />
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang, {user?.name || user?.id}!</h1>
          <p className="text-muted-foreground">Dashboard PustakaTerpadu - {user?.role === "librarian" ? "Librarian" : "Member"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pinjaman Aktif
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">buku sedang dipinjam</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terlambat
            </CardTitle>
            <Clock className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.overdueLoans > 0 ? "text-destructive" : ""}`}>
              {stats.overdueLoans}
            </div>
            <p className="text-xs text-muted-foreground">buku melewati jatuh tempo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Denda
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.totalFines > 0 ? "text-destructive" : "text-green-600"}`}>
              {formatCurrency(stats.totalFines)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFines > 0 ? "perlu dibayar" : "tidak ada denda"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pinjaman Terbaru</CardTitle>
          <Link to="/fines">
            <Button variant="ghost" size="sm">
              Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLoans.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Belum ada pinjaman aktif
            </p>
          ) : (
            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div
                  key={loan.loanId}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{loan.book?.title || `Book ID: ${loan.bookId}`}</p>
                      <p className="text-sm text-muted-foreground">
                        Kembali: {formatDate(loan.dueAt)}
                      </p>
                    </div>
                  </div>
                  {loan.lateDays > 0 ? (
                    <Badge variant="destructive">Terlambat {loan.lateDays} hari</Badge>
                  ) : (
                    <Badge variant="default">Aktif</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
