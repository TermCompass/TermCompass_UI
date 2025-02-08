"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "../contexts/AdminAuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Star, CheckCircle, Bot } from "lucide-react"
import {LineChart, Line,CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,Legend } from "recharts";

export default function AdminDashboard() {
  const { admin } = useAdminAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false);

  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [recordCounts, setRecordCounts] = useState<{ REVIEW?: number; GENERATE?: number; CHAT?: number }>({})
  const [userData, setUserData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    if (!admin && !hasRedirected) {
      setHasRedirected(true); // 리디렉션 상태를 기록
      router.push("/admin/login");
    }
  }, [admin, router, hasRedirected]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/users") // API 호출
        if (!response.ok) {
          throw new Error("Failed to fetch user count")
        }
        const count = await response.json()
        setTotalUsers(count) // 상태 업데이트
      } catch (error) {
        console.error("Error fetching user count:", error)
      }
    }
    fetchUserCount()
  }, [])

  useEffect(() => {
    const fetchRecordCounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/records")
        if (!response.ok) throw new Error("Failed to fetch record counts")
        const data = await response.json()
        setRecordCounts(data) // API 응답 저장
      } catch (error) {
        console.error("Error fetching record counts:", error)
      }
    }

    fetchRecordCounts()
  }, [])

  useEffect(() => {
    fetch("http://localhost:8080/stats/logins")
        .then((res) => res.json())
        .then((data) => {
          const formattedData = data.map((item: { date: string; loginCount: number }) => ({
            date: item.date,
            users: item.loginCount,
          }));
          setUserData(formattedData);
        })
        .catch((error) => console.error("Error fetching login stats:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/stats/records")
        .then((res) => res.json())
        .then((data) => {
          const formattedData = data.map((item: { date: string; generateCount: number; reviewCount: number; chatCount: number }) => ({
            date: item.date,
            generateCount: item.generateCount,
            reviewCount: item.reviewCount,
            chatCount: item.chatCount,
          }));
          setDailyStats(formattedData);
        })
        .catch((error) => console.error("Error fetching daily stats:", error));
  }, []);

  // admin이 없으면 아무 것도 렌더링하지 않음
  if (admin === null) {
    return null
  }

  const pieData = [
    { name: "A", value: 40 },
    { name: "B", value: 10 },
    { name: "C", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  return (
      <div>
        {/* 📌 Y축을 8칸으로 세분화 */}
        <div className="grid grid-cols-6 md:grid-cols-3 grid-rows-12 gap-6">
          <div className="col-span-full row-span-2 grid grid-cols-4 gap-4">
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">회원 수</CardTitle>
                <Users className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium">총 생성 수</CardTitle>
                <FileText className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{recordCounts.GENERATE ?? 0}</div>
              </CardContent>
            </Card>

            {/* ✅ 총 리뷰 수 */}
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">총 검토 수</CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{recordCounts.REVIEW ?? 0}</div>
              </CardContent>
            </Card>

            {/* ✅ 당일 검토 수 */}
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">챗봇 이용 수</CardTitle>
                <Bot className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{recordCounts.CHAT ?? 0}</div>
              </CardContent>
            </Card>


          </div>
          {/* ✅ 당일 이용자 수 */}


          {/* ✅ 2행에 내부 2열 그리드 추가 */}
          <div className="col-span-full row-span-3 grid grid-cols-2 gap-4">

            {/* ▶  사용자 방문수 */}
            <Card className="bg-white shadow-lg flex flex-col justify-center items-center p-4 w-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium">일별 방문 수</CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[300px]">
                {/* ✅ ResponsiveContainer 추가 (크기 문제 해결) */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg flex flex-col justify-center items-center p-4 w-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium">일별 요청 수</CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[300px]">
                {/* ✅ ResponsiveContainer 추가 (크기 문제 해결) */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10 }} />
                    <Line type="monotone" dataKey="generateCount" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} name="생성" />
                    <Line type="monotone" dataKey="reviewCount" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} name="검토" />
                    <Line type="monotone" dataKey="chatCount" stroke="#FFBB28" strokeWidth={2} dot={{ r: 4 }} name="챗봇" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white shadow-lg row-span-3 col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등급 분포</CardTitle>
              <Star className="h-4 w-4 text-gray-600"/>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>


  )
}
