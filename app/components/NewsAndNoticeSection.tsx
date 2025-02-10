import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import FooterSection from './FooterSection'
// 실제 DB에서 가져와야함
const notices = {
  government: [
    { title: '개인정보보호법 개정안 발표', date: '2023-06-15' },
    { title: '전자상거래법 시행령 개정', date: '2023-06-10' },
    { title: '인공지능 윤리기준 가이드라인 발표', date: '2023-06-05' },
  ]
}
//DB에서 사진데이터 가져와서 전시해야함
const newsItems = [
  { title: '공정거래 센터', image: '/공고1.jpg', link: 'https://edu.kofair.or.kr/' },
  { title: '공고2', image: '/공고2.png',link: 'https://kofair.or.kr/home/board/brdDetail.do?menu_cd=000114&num=1860'}
]

export default function NewsAndNoticeSection() {
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
    <div className="flex flex-col">
      <section className="min-h-[calc(90vh)] py-8 sm:py-16 flex items-center overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-center">공지사항</h2>
              <Tabs defaultValue="government" className="w-full">
                {Object.entries(notices).map(([key, items]) => (
                  <TabsContent key={key} value={key}>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center border-b pb-2">
                          <span>{item.title}</span>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="relative overflow-hidden mt-12">
              <h2 className="text-3xl font-bold mb-6 text-center">포토 뉴스</h2>
              <Card className="flex flex-col items-center justify-center h-auto mx-auto p-4 shadow-lg rounded-lg">
                <CardHeader className="w-full flex items-center justify-center">
                  <a href={newsItems[currentIndex].link}>
                    <Image
                        src={newsItems[currentIndex].image || "/placeholder.svg"}
                        alt={newsItems[currentIndex].title}

                        width={400}
                        height={200}
                        className="rounded-t-lg"
                    />
                  </a>
                </CardHeader>
              </Card>
              <Button
                variant="outline"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
