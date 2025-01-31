// `TermCompass_UI/app/layout.tsx`
import './globals.css'
import { Inter } from 'next/font/google'
import { UserProvider } from './contexts/UserContext'
import { Toaster } from "@/components/ui/toaster"
import { ChatbotProvider } from './contexts/ChatbotContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '약관나침반 - 전문적인 약관 검토 및 관리 서비스',
  description: '개인, 기업, 공공기관을 위한 AI 기반 약관 검토 및 관리 솔루션',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <UserProvider>
          <ChatbotProvider>
            {children}
            <Toaster />
          </ChatbotProvider>
        </UserProvider>
      </body>
    </html>
  )
}