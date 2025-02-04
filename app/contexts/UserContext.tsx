"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface IndividualUser {
  email: string
  userType: "PERSONAL"
  name: string
  created_at: string
}

interface BusinessUser {
  email: string
  userType: "COMPANY"
  name: string
  created_at: string
  businessNumber: string
}

type User = IndividualUser | BusinessUser

interface UserContextType {
  user: User | null
  login: (name: string, email: string, userType: "PERSONAL" | "COMPANY", created_at: string, businessNumber?: string) => void
  logout: () => void
  updateUser: (updatedInfo: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    axios
        .get("http://localhost:8080/user", { withCredentials: true })
        .then((response) => {
          let currentUser = response.data
          if (currentUser.account_type === "PERSONAL") {
            setUser({
              email: currentUser.email,
              userType: currentUser.account_type,
              name: currentUser.name,
              created_at: currentUser.created_at
            })
          } else {
            setUser({
              email: currentUser.email,
              userType: currentUser.account_type,
              name: currentUser.name,
              created_at: currentUser.created_at,
              businessNumber: currentUser.businessNumber
            })
          }
        })
        .catch(() => {
          setUser(null);
        });
  }, []);

  const login = (name: string, email: string, userType: "PERSONAL" | "COMPANY", created_at: string, businessNumber?: string) => {
    if (userType === "PERSONAL") {
      setUser({ email: email, userType: userType, name: name, created_at: created_at })
    } else {
      // @ts-ignore
      setUser({ email: email, userType: userType, name: name, created_at: created_at, businessNumber: businessNumber })
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (updatedInfo: Partial<User>) => {
    // @ts-ignore
    setUser((prevUser) => {
      if (!prevUser) return null
      return { ...prevUser, ...updatedInfo }
    })
  }

  return <UserContext.Provider value={{ user, login, logout, updateUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

