"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "../contexts/AdminAuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Star } from "lucide-react"
import {LineChart, Line,CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,Legend } from "recharts";

export default function AdminDashboard() {
  const { admin } = useAdminAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!admin && !hasRedirected) {
      setHasRedirected(true); // 리디렉션 상태를 기록
      router.push("/admin/login");
    }
  }, [admin, router, hasRedirected]);

  // admin이 없으면 아무 것도 렌더링하지 않음
  if (admin === null) {
    return null
  }
  // 더미데이터 실제로는 DB연동해야함
  const userData = [
    { date: "01-01", users: 150 },
    { date: "01-02", users: 200 },
    { date: "01-03", users: 250 },
    { date: "01-04", users: 180 },
    { date: "01-05", users: 220 },
  ];

  const userData2 = [
    { date: "01-01", users: 150 },
    { date: "01-02", users: 200 },
    { date: "01-03", users: 250 },
    { date: "01-04", users: 180 },
    { date: "01-05", users: 220 },
  ];

//  최신 값 (가장 마지막 날짜의 users)
  const currentUsers = userData[userData.length - 1]?.users || 0;

//  지난 값 (그 이전 날짜의 users)
  const prevUsers = userData[userData.length - 2]?.users || currentUsers;

//  변화율 계산
  const changeRate = ((currentUsers - prevUsers) / prevUsers) * 100;
  const isIncrease = changeRate >= 0;
  const dummyData = {
    totalUsers: 1234,
    totalReviews: 5678,
    averageRating: 4.7,
  }
  const pieData = [
    { name: "A", value: 40 },
    { name: "B", value: 10 },
    { name: "C", value: 10 },
  ];
  const chatbotCategoryData = [
    { category: "결제 관련", count: 320 },
    { category: "회원가입", count: 250 },
    { category: "제품 문의", count: 400 },
    { category: "기술 지원", count: 180 },
    { category: "기타", count: 150 },
  ];


  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  return (
      <div>
        {/* 📌 Y축을 8칸으로 세분화 */}
        <div className="grid grid-cols-6 md:grid-cols-3 grid-rows-12 gap-6">
          <div className="col-span-full row-span-2 grid grid-cols-4 gap-4">
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium">당일 이용자 수</CardTitle>
                <Users className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{dummyData.totalUsers}</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>

            {/* ✅ 총 리뷰 수 */}
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">총 리뷰 수</CardTitle>
                <FileText className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">{dummyData.totalReviews}</div>
                <p className="text-xs text-gray-500">+180 from last week</p>
              </CardContent>
            </Card>

            {/* ✅ 당일 검토 수 */}
            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">당일 검토 수</CardTitle>
                <FileText className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">23</div>
                <p className="text-xs text-gray-500">+180 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg row-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-9">
                <CardTitle className="text-xl font-medium items-center">회원 수</CardTitle>
                <FileText className="h-4 w-4 text-gray-600"/>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">23</div>
                <p className="text-xs text-gray-500">+180 from last week</p>
              </CardContent>
            </Card>
          </div>
          {/* ✅ 당일 이용자 수 */}


          {/* ✅ 2행에 내부 2열 그리드 추가 */}
          <div className="col-span-full row-span-3 grid grid-cols-2 gap-4">

            {/* ▶  사용자 방문수 */}
            <Card className="bg-white shadow-lg flex flex-col justify-center items-center p-4 w-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium">일별 방문수</CardTitle>
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
                <CardTitle className="text-sm font-medium">챗봇 대답 유형</CardTitle>
              </CardHeader>
              <CardContent className="w-full h-[250px]">
                {/* ✅ ResponsiveContainer 추가 (크기 문제 해결) */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chatbotCategoryData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" barSize={30} />
                  </BarChart>
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
