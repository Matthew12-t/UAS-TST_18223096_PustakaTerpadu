import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Library,
  Clock,
  AlertTriangle,
  RotateCcw,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react"
import { useState } from "react"

export default function Layout({ children }) {
  const { user, logout, isLibrarian } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home, requiresAuth: true },
    { path: "/books", label: "Katalog Buku", icon: Library, requiresAuth: false },
    { path: "/fines", label: "Pinjaman & Denda", icon: BookOpen, requiresAuth: true },
    { path: "/return", label: "Pengembalian", icon: RotateCcw, requiresAuth: true, librarianOnly: true },
  ]

  const filteredNavItems = navItems.filter((item) => {
    if (item.librarianOnly && !isLibrarian) return false
    if (item.requiresAuth && !user) return false
    return true
  })

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="PustakaTerpadu" className="h-10 w-auto" />
              <span className="font-bold text-xl hidden sm:inline">
                <span className="text-primary">Pustaka</span>
                <span className="text-secondary">Terpadu</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {filteredNavItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium">{user.name || user.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {isLibrarian ? "Librarian" : "Member"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button size="sm">Masuk</Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              {user && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 mt-2"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="PustakaTerpadu" className="h-8 w-auto" />
              <span className="text-sm text-muted-foreground">
                © 2026 PustakaTerpadu. UAS TST - 18223096
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Integrasi Books Service & Loan Service
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
