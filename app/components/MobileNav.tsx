'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

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
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg ${
                pathname === item.href ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
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
