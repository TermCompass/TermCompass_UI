'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '../contexts/UserContext'

const boards = [
  { name: '약관 리뷰', link: '/review-request', userType: 'all' },
  { name: 'AI 챗봇', link: '/ai-chatbot', userType: 'all' },
  { name: '사이트 등급', link: '/site-analysis', userType: 'all' },
  { name: '약관 생성', link: '/create-terms', userType: 'COMPANY' },
  // { name: '약관 수정', link: '/modify-terms', userType: 'COMPANY' },  // 임시로 비활성화
  { name: '이용 내역', link: '/business-history', userType: 'COMPANY' },
  { name: '검토 내역', link: '/review-history', userType: 'PERSONAL' },
]

export default function BoardSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const { user } = useUser()

  const filteredBoards = boards.filter(board => 
    board.userType === 'all' || board.userType === user?.userType
  )

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBoards.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredBoards.length) % filteredBoards.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleCardClick = (link: string) => {
    router.push(link)
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">약관나침반 서비스</h2>
        <div className="relative">
          <div className="flex items-center justify-center">
            <Button variant="outline" onClick={prevSlide} className="mr-4">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex space-x-4">
              {[-1, 0, 1].map((offset) => {
                const index = (currentIndex + offset + filteredBoards.length) % filteredBoards.length;
                const board = filteredBoards[index];
                return (
                  <Card 
                    key={index}
                    className={`w-64 h-80 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${offset === 0 ? '' : 'opacity-50'}`}
                    onClick={() => handleCardClick(board.link)}
                  >
                    <div className="relative w-full h-3/4">
                      <Image 
                        src={`/placeholder.svg?height=300&width=256&text=${board.name}`}
                        alt={board.name}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    </div>
                    <CardContent className="h-1/4 flex items-center justify-center">
                      <h3 className="text-lg font-semibold text-center">{board.name}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button variant="outline" onClick={nextSlide} className="ml-4">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            {filteredBoards.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
