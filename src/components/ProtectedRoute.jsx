import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Spinner } from "@/components/ui/spinner"

export function ProtectedRoute({ children, librarianOnly = false }) {
  const { user, loading, isLibrarian } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (librarianOnly && !isLibrarian) {
    return <Navigate to="/" replace />
  }

  return children
}
