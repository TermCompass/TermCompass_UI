'use client'

import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import AuthForm from './AuthForm'

export default function AuthModal() {
  const { isAuthFormOpen, setIsAuthFormOpen, authType } = useAuth()
  const { login } = useUser()

  if (!isAuthFormOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AuthForm
        initialUserType={authType}
        onSubmit={(name, email, password, userType, businessNumber, isLogin) => {
          login(email, userType);
          setIsAuthFormOpen(false);
        }}
        onCancel={() => setIsAuthFormOpen(false)}
      />
    </div>
  )
} 