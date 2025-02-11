'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const newsItems = [
  { title: '인공지능 기반 약관 분석 서비스 출시', image: 'https://source.unsplash.com/random/800x600?ai-analysis' },
  { title: '소비자 권익 보호를 위한 새로운 법안 발의', image: 'https://source.unsplash.com/random/800x600?consumer-rights' },
  { title: '온라인 플랫폼 기업들의 약관 개선 노력', image: 'https://source.unsplash.com/random/800x600?online-platform' },
  { title: '데이터 3법 시행 1년, 그 영향과 전망', image: 'https://source.unsplash.com/random/800x600?data-law' },
]

export default function PhotoNews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length)
  }

  return (
    <section className="py-12 relative">
         <h2 className="text-3xl font-bold mb-6 text-center">카드 뉴스</h2>
         <Card>
            <CardHeader>
              <Image
                src={newsItems[currentIndex].image || "/placeholder.svg"}
                alt={newsItems[currentIndex].title}
                width={300}
                height={200}
                className="rounded-t-lg"
                unoptimized
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="truncate text-center">{newsItems[currentIndex].title}</CardTitle>
            </CardContent>
         </Card>
        <Button variant="outline" className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full" onClick={prevSlide}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full" onClick={nextSlide}>
          <ChevronRight className="h-4 w-4" />
        </Button>
    </section>
  )
}
