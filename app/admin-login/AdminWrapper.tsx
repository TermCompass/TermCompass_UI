"use client"

import { AdminAuthProvider } from "../contexts/AdminAuthContext"

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}

