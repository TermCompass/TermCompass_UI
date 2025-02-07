'use client'

import { createContext, useContext, useState, ReactNode } from "react"

interface AuthContextType {
  isAuthFormOpen: boolean
  setIsAuthFormOpen: (isOpen: boolean) => void
  authType: 'PERSONAL' | 'COMPANY'
  setAuthType: (type: 'PERSONAL' | 'COMPANY') => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthFormOpen: false,
  setIsAuthFormOpen: () => {},
  authType: 'PERSONAL',
  setAuthType: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false)
  const [authType, setAuthType] = useState<'PERSONAL' | 'COMPANY'>('PERSONAL')

  const handleSetAuthFormOpen = (isOpen: boolean) => {
    console.log('Setting auth form open:', isOpen);
    setIsAuthFormOpen(isOpen);
  };

  const handleSetAuthType = (type: 'PERSONAL' | 'COMPANY') => {
    console.log('Setting auth type:', type);
    setAuthType(type);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthFormOpen, 
      setIsAuthFormOpen: handleSetAuthFormOpen, 
      authType, 
      setAuthType: handleSetAuthType 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
} 