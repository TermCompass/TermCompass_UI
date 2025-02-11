'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

interface Website {
  name: string;
  logo: string;
  grade: string;
  benefits: string[];
  drawbacks: string[];
  link: string;
}

const getBackgroundColor = (grade: string) => {
  switch (grade) {
    case 'A':
      return 'bg-green-500 hover:bg-green-600'; // 더 진한 초록색
    case 'B':
      return 'bg-blue-500 hover:bg-blue-600'; // 더 진한 파란색
    case 'C':
      return 'bg-yellow-400 hover:bg-yellow-500'; // 더 밝은 노란색
    case 'D':
      return 'bg-orange-400 hover:bg-orange-500'; // 더 밝은 주황색
    case 'E':
      return 'bg-red-500 hover:bg-red-600'; // 더 진한 빨간색
    default:
      return 'bg-gray-400 hover:bg-gray-500'; // 더 진한 회색
  }
};
type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'ALL';

const gradeDescriptions = {
  'ALL': 'KOTS는 사용자에게 투명하고 공정한 정보 제공을 통해, 안전하고 신뢰할 수 있는 선택을 할 수 있도록 돕습니다.',
  'A': '서비스 약관은 회원님을 공정하게 대우하고 회원님의 권리를 존중하며 회원님의 데이터를 남용하지 않습니다.',
  'B': '서비스 약관은 사용자에게 공정하지만 개선할 수 있는 부분이 있습니다.',
  'C': '서비스 약관은 대체로 괜찮지만 몇 가지 문제를 고려해야 합니다.',
  'D': '서비스 약관이 전반적으로 사업자에게 유리하게 작성되어 있어 이용에 각별한 주의가 필요합니다.',
  'E': '서비스 약관이 사용자의 권리를 심각하게 침해할 수 있는 내용을 포함하고 있습니다.',
};

export default function SiteRatings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<Grade>('ALL')
  const [websites, setWebsites] = useState<Website[]>([])

  useEffect(() => {
      const fetchWebsites = async () => {
          try {
            const response = await fetch("/site")
            if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.")

            const data: Website[] = await response.json()
            setWebsites(data)
          } catch (error) {
            console.error(error)
          }
        }
        fetchWebsites()
   }, [])

 const filteredRatings = websites.filter(site =>
     (selectedGrade === 'ALL' || site.grade === selectedGrade) &&
     (site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       site.link.toLowerCase().includes(searchTerm.toLowerCase()))
   )

  const renderSiteCard = (site: websites) => (
    <Link href={`/site-analysis/${site.link}`} key={site.link} className="block">
      <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center mb-2">
          <Image src={`/site-logo/${site.logo}`}  alt={`${site.name} 로고`} width={50} height={50} className="mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{site.name}</h2>
            <p className="text-blue-600">{site.link}</p>
          </div>
          <Badge className={`ml-auto text-lg font-bold ${getBackgroundColor(site.grade)}`}>{site.grade}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-600">유리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index}>
                    {benefit.length > 12 ? `${benefit.slice(0, 12)}...` : benefit}
                  </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">불리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.drawbacks.slice(0, 3).map((drawback, index) => (
                  <li key={index}>
                    {drawback.length > 12 ? `${drawback.slice(0, 12)}...` : drawback}
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 p-8">사이트별 등급과 약관 평가</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {(['ALL', 'A', 'B', 'C', 'D', 'E'] as const).map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? "default" : "outline"}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-full ${
                    selectedGrade === grade
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 border-blue-500'
                  }`}
                >
                  {grade === 'ALL' ? '전체' : `${grade}등급`}
                </Button>
              ))}
            </div>
            <Input
              type="text"
              placeholder="사이트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
          
          <div className="relative py-4 mb-4">
            <div className={`
              max-w-6xl mx-auto px-6 py-3 rounded-lg
              ${selectedGrade === 'ALL' 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
                : selectedGrade === 'A'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
                : selectedGrade === 'B'
                ? 'bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100'
                : selectedGrade === 'C'
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100'
                : selectedGrade === 'D'
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-100'
              }
            `}>
              <p className={`
                text-center font-medium
                ${selectedGrade === 'ALL' 
                  ? 'text-blue-800'
                  : selectedGrade === 'A'
                  ? 'text-green-800'
                  : selectedGrade === 'B'
                  ? 'text-blue-800'
                  : selectedGrade === 'C'
                  ? 'text-yellow-800'
                  : selectedGrade === 'D'
                  ? 'text-orange-800'
                  : 'text-red-800'
                }
              `}>
                {gradeDescriptions[selectedGrade || 'ALL']}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRatings.map(renderSiteCard)}
            </div>
          </div>
          {filteredRatings.length === 0 && (
            <p className="text-center text-gray-500 mt-4">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}
