"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "../contexts/AdminAuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GeneratePage() {
  const { admin } = useAdminAuth()
  const router = useRouter()
  const [industry, setIndustry] = useState("")
  const [termsContent, setTermsContent] = useState("") // 표준약관 내용 관리

  useEffect(() => {
    if (!admin) {
      router.push("/admin/login")
    }
  }, [admin, router])

  if (!admin) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 표준약관 내용 저장 (예: 서버로 전송하거나 다른 로직을 처리)
    console.log("작성된 표준약관 내용: ", termsContent)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">표준약관 생성</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>산업 분야 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="industry">산업 분야</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="예: 전자상거래, 여행, 숙박 등"
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>표준약관 내용 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="termsContent">표준약관 내용</Label>
            <Textarea
              id="termsContent"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)} // 입력값 관리
              placeholder="표준약관을 여기에 입력하세요."
              className="mt-2"
              rows={10}
            />
          </CardContent>
        </Card>
        <Button type="submit">표준약관 저장</Button>
      </form>
    </div>
  )
}
