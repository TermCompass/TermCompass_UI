"use client"

import { useAdminAuth } from "../contexts/AdminAuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const { admin } = useAdminAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      <Card>
        <CardHeader>
          <CardTitle>환영합니다, admin님!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>이 대시보드에서 다양한 관리 작업을 수행할 수 있습니다.</p>
          {/* 여기에 대시보드 위젯이나 요약 정보를 추가할 수 있습니다 */}
        </CardContent>
      </Card>
    </div>
  )
}

