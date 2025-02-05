"use client"

import { AdminAuthProvider } from "../contexts/AdminAuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/update-caselaw", label: "판례 업데이트" },
  { href: "/admin/update-terms", label: "표준약관 업데이트" },
  { href: "/admin/generate", label: "표준약관 생성" },
  //{ href: "/admin/report", label: "서비스 현황/리포트" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AdminAuthProvider>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h1 className="text-2xl font-bold">약관나침반 관리자</h1>
          </div>
          <nav className="mt-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 px-4 text-sm hover:bg-gray-700 transition-colors",
                  pathname === item.href && "bg-gray-700 font-semibold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </AdminAuthProvider>
  )
}

