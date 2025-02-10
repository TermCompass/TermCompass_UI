"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminUser {
  email: string
  token: string
}

interface AdminAuthContextType {
  admin: AdminUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://kyj9447.ddns.net:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("로그인 실패: 잘못된 사용자명 또는 비밀번호입니다.")
      }

      const data = await response.json()
      const adminUser = { email, token: data.token }

      setAdmin(adminUser)
      localStorage.setItem("admin", JSON.stringify(adminUser))
    } catch (error) {
      console.error("로그인 오류:", error)
      throw error
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  return <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
