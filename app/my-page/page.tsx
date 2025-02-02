"use client"

import { useState } from "react"
import { useUser } from "../contexts/UserContext"
import Layout from "../components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserInfoForm from "../components/UserInfoForm"
import ChangePasswordForm from "@/app/components/ChangePasswordForm"
import ReviewHistory from "../components/ReviewHistory"
import BusinessHistory from "../components/BusinessHistory"

export default function MyPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<"info" | "history">("info")
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardContent>
              <p>로그인이 필요합니다.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>마이페이지</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "info" | "history")}>
              <TabsList>
                <TabsTrigger value="info">개인 정보</TabsTrigger>
                <TabsTrigger value="history">{user.userType === "PERSONAL" ? "검토 내역" : "이용 내역"}</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                {showPasswordForm ? (
                    <ChangePasswordForm onCancel={() => setShowPasswordForm(false)} />
                ) : (
                    // @ts-ignore
                    <UserInfoForm onChangePassword={() => setShowPasswordForm(true)} />
                )}
              </TabsContent>
              <TabsContent value="history">
                {user.userType === "PERSONAL" ? <ReviewHistory /> : <BusinessHistory />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

