import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import BooksPage from "@/pages/BooksPage"
import BookDetailPage from "@/pages/BookDetailPage"
import FinesPage from "@/pages/FinesPage"
import ReturnBookPage from "@/pages/ReturnBookPage"
import "./index.css"

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <Layout>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/books"
        element={
          <Layout>
            <BooksPage />
          </Layout>
        }
      />
      <Route
        path="/books/:id"
        element={
          <Layout>
            <BookDetailPage />
          </Layout>
        }
      />
      {/* Redirect /my-loans to /fines since loans are shown on fines page */}
      <Route path="/my-loans" element={<Navigate to="/fines" replace />} />
      <Route
        path="/fines"
        element={
          <Layout>
            <ProtectedRoute>
              <FinesPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/return"
        element={
          <Layout>
            <ProtectedRoute librarianOnly>
              <ReturnBookPage />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
