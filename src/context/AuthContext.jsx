import { createContext, useContext, useState, useEffect } from "react"
import { SignJWT } from "jose"
import { loanApi } from "@/services/loanApi"

const AuthContext = createContext(null)

// JWT Secret untuk Books Service (hanya untuk testing)
const BOOKS_JWT_SECRET = "inicontohjwtbodongajabuattesting"

// Generate token untuk Books Service
async function generateBooksToken(userId, role) {
  const secret = new TextEncoder().encode(BOOKS_JWT_SECRET)
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret)
  return token
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null) // Token (Loan Service)
  const [booksToken, setBooksToken] = useState(null) // Token (Books Service)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedBooksToken = localStorage.getItem("booksToken")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setBooksToken(storedBooksToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (userId, role) => {
    const response = await loanApi.login(userId, role)
    const loanToken = response.token
    
    const booksSvcToken = await generateBooksToken(userId, role)
    
    const userData = {
      id: userId,
      name: userId,
      role: role,
    }
    
    setToken(loanToken)
    setBooksToken(booksSvcToken)
    setUser(userData)
    localStorage.setItem("token", loanToken)
    localStorage.setItem("booksToken", booksSvcToken)
    localStorage.setItem("user", JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setToken(null)
    setBooksToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("booksToken")
    localStorage.removeItem("user")
  }

  const isLibrarian = user?.role === "librarian"

  return (
    <AuthContext.Provider value={{ user, token, booksToken, login, logout, loading, isLibrarian }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
