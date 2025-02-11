"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {AdminAuthProvider, useAdminAuth} from "../contexts/AdminAuthContext"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function UpdateLegislationPage() {
  const { admin } = useAdminAuth()
  const router = useRouter()
  const [legislation, setLegislation] = useState("")

  useEffect(() => {
    // if (!admin) {
    //   router.push("/admin/login")
    // }
  }, [admin, router])

  if (!admin) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    alert("법령 업데이트가 성공적으로 제출되었습니다.")
    setLegislation("")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">법령 업데이트</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">새로운 법령 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="legislation" className="text-sm font-medium text-gray-700">
              법령 내용
            </Label>
            <Textarea
              id="legislation"
              value={legislation}
              onChange={(e) => setLegislation(e.target.value)}
              placeholder="새로운 법령을 입력하세요"
              className="mt-2 border-gray-300"
              rows={10}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="bg-gray-800 hover:bg-gray-700">
           법령 업데이트 제출
        </Button>
      </form>
    </div>
  )
}

export default function AdminWrapper() {
  return <AdminAuthProvider><UpdateLegislationPage /></AdminAuthProvider>
}