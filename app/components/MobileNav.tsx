'use client'
 
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from 'lucide-react'
 
interface NavItem {
  href: string
  label: string
}
 
interface MobileNavProps {
  navItems: NavItem[]
  user: { email: string; userType: 'PERSONAL' | 'COMPANY' } | null
  onLogout: () => void
  onLogin: () => void
  buttonColor: string
}
 
export default function MobileNav({ navItems, user, onLogout, onLogin, buttonColor }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  // const [isBoardOpen, setIsBoardOpen] = useState(false) // ✅ 게시판 토글 상태 추가
  const pathname = usePathname()
 
  return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className={buttonColor}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
                <div key={item.href} className="relative">
                  <Link href={item.href}>
                    <button
                      className={`text-lg flex items-center justify-between w-full ${
                          pathname === item.href ? 'text-blue-600 font-semibold' : 'text-gray-600'
                      }`}
                      // onClick={() => {
                      //   if (item.label === "게시판") {
                      //     setIsBoardOpen(!isBoardOpen); // ✅ 게시판 클릭 시 토글
                      //   } else {
                      //     setOpen(false);
                      //   }
                      // }}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                      {/* {item.label === "게시판" && (
                        <ChevronDown
                            className={`transition-transform duration-300 ${
                                isBoardOpen ? "rotate-180" : ""
                            }`}
                        />
                    )} */}
                    </button>
                  {/* 🔹 하위 메뉴 (게시판 클릭 시 펼쳐짐) */}
                  {/* {item.label === "게시판" && isBoardOpen && (
                      <div className="mt-2 ml-4 border-l border-gray-300 pl-3 transition-all duration-300">
                        <Link href="/board" className="block p-2 text-gray-700 hover:text-blue-500" onClick={() => setOpen(false)}>
                          📌 공지사항
                        </Link>
                        <Link href="/photonews" className="block p-2 text-gray-700 hover:text-blue-500" onClick={() => setOpen(false)}>
                          📷 포토뉴스
                        </Link>
                      </div>
                  )} */}
                  </Link>
                </div>
            ))}
            {user ? (
                <Button onClick={() => { onLogout(); setOpen(false); }} className="mt-4">
                  로그아웃
                </Button>
            ) : (
                <Button onClick={() => { onLogin(); setOpen(false); }} className="mt-4">
                  로그인 / 회원가입
                </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
  )
}
 