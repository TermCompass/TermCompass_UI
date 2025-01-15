'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import AuthForm from './AuthForm'
import { useUser } from '../contexts/UserContext'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showAuthForm, setShowAuthForm] = useState(false)
  const { user, login, logout } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const businessOnlyPaths = ['/create-terms', '/modify-terms', '/business-history']
    if (businessOnlyPaths.includes(pathname) && (!user || user.userType !== 'business')) {
      toast({
        title: "접근 제한",
        description: "이 기능은 기업 사용자 전용입니다.",
        variant: "destructive",
      })
      router.push('/')
    }
  }, [pathname, user, router])

  const navItems = [
    { href: '/', label: '홈' },
    { href: '/ai-chatbot', label: 'AI 챗봇' },
    { href: '/site-analysis', label: '사이트 등급' },
    { href: '/review-request', label: '약관 검토' },
    ...(user
      ? user.userType === 'business'
        ? [
            { href: '/create-terms', label: '약관 생성' },
            { href: '/modify-terms', label: '약관 수정' },
            { href: '/business-history', label: '이용 내역' },
          ]
        : [
            { href: '/review-history', label: '검토 내역' },
          ]
      : []
    ),
  ]

  const handleAuthSubmit = (email: string, password: string, userType: 'individual' | 'business', additionalInfo: string, isLogin: boolean) => {
    // Here you would typically make an API call to authenticate the user
    // For this example, we'll just log in the user directly
    login(email, userType)
    setShowAuthForm(false)
    // You can use the additionalInfo for further processing if needed
    console.log('Additional Info:', additionalInfo)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-500 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
              <Image
                  src={`/TermCompass_logo.png`}
                  alt={'logo'}
                  width={50}
                  height={50}
              />
          </Link>
          <nav>
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`hover:text-blue-200 transition-colors ${
                      pathname === item.href ? 'text-blue-200' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {user ? (
            <Button
              onClick={logout}
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-100"
            >
              로그아웃
            </Button>
          ) : (
            <Button
              onClick={() => setShowAuthForm(true)}
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-100"
            >
              로그인 / 회원가입
            </Button>
          )}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {user && pathname === '/ai-chatbot' ? (
          <div className="flex">
            <div className="flex-grow ml-4">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <footer className="bg-gray-200 text-center py-4">
        <p>&copy; 2025 약관나침반. All rights reserved.</p>
      </footer>
      {showAuthForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AuthForm 
            onSubmit={handleAuthSubmit} 
            onCancel={() => setShowAuthForm(false)}
          />
        </div>
      )}
    </div>
  )
}

