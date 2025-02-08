'use client'

import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import AuthForm from './AuthForm'

export default function AuthModal() {
  const { isAuthFormOpen, setIsAuthFormOpen } = useAuth()
  const { login } = useUser()

  if (!isAuthFormOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AuthForm
        onSubmit={(id, name, email, userType, created_at, businessNumber, isLogin) => {
          login(id, name, email, 'PERSONAL', created_at)
          setIsAuthFormOpen(false)
        }}
        onCancel={() => setIsAuthFormOpen(false)}
      />
    </div>
  )
} 