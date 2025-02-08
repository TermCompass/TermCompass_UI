'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Layout from '../../components/Layout'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AIReviewResult {
  grade: string
  analysis: string
  alternatives: string[]
}

const ReviewResultContent = () => {
  const searchParams = useSearchParams()
  const [reviewResult, setReviewResult] = useState<AIReviewResult | null>(null)

  useEffect(() => {
    const domain = searchParams.get('domain')
    const terms = searchParams.get('terms')
    const clauses = JSON.parse(searchParams.get('clauses') || '[]')

    // Simulate AI review process
    setTimeout(() => {
      const mockReviewResult: AIReviewResult = {
        grade: 'B',
        analysis: `${domain} 도메인에 대한 약관 분석 결과입니다. 전반적으로 표준적인 내용을 담고 있으나, 일부 조항에서 개선의 여지가 있습니다. 특히, 개인정보 처리와 관련된 부분에서 더 명확한 설명이 필요합니다.`,
        alternatives: [
          '제7조의 "서비스 제공자의 책임" 부분에서 책임 범위를 더 구체적으로 명시하는 것이 좋습니다.',
          '제12조의 "개인정보 처리" 부분에서 정보 수집 목적과 보관 기간을 명확히 명시하는 것이 필요합니다.',
          '제15조의 "분쟁 해결" 부분에서 중재 절차에 대한 설명을 추가하는 것이 좋습니다.'
        ]
      }
      setReviewResult(mockReviewResult)
    }, 2000)
  }, [searchParams])

  if (!reviewResult) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">AI 모델 검토 중...</h1>
          <p>약관을 분석하고 있습니다. 잠시만 기다려주세요.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">AI 모델 검토 결과</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              최종 등급
              <Badge variant="outline" className="text-2xl">{reviewResult.grade}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">분석 결과</h2>
            <p className="mb-4">{reviewResult.analysis}</p>
            <h2 className="text-xl font-semibold mb-2">개선 제안</h2>
            <ul className="list-disc list-inside">
              {reviewResult.alternatives.map((alternative, index) => (
                <li key={index} className="mb-2">{alternative}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default function ReviewResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewResultContent />
    </Suspense>
  )
}

