import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("member")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validateUserId = (id, selectedRole) => {
    if (selectedRole === "member") {
      return /^U\d{3}$/i.test(id)
    } else if (selectedRole === "librarian") {
      return /^L\d{3}$/i.test(id)
    }
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateUserId(userId, role)) {
      if (role === "member") {
        setError("Member harus menggunakan User ID dengan format U001, U002, dst.")
      } else {
        setError("Librarian harus menggunakan User ID dengan format L001, L002, dst.")
      }
      return
    }

    setLoading(true)
    try {
      await login(userId, role)
      navigate("/")
    } catch (err) {
      setError(err.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="PustakaTerpadu" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl">Masuk ke PustakaTerpadu</CardTitle>
          <CardDescription>Masukkan User ID dan pilih role Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder={role === "member" ? "Contoh: U001, U002" : "Contoh: L001, L002"}
                value={userId}
                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                required
              />
              <p className="text-xs text-muted-foreground">
                {role === "member" 
                  ? "Member: U diikuti 3 digit angka (contoh: U001, U002)" 
                  : "Librarian: L diikuti 3 digit angka (contoh: L001, L002)"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="librarian">Librarian</option>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
