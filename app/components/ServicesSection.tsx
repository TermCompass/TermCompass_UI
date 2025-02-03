import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, FileText, Bot } from 'lucide-react';
import { topWebsites } from "@/app/components/TopWebsites";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useUser } from '@/app/contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
const services = [
  {
    title: '약관 검토',
    description: 'AI 기반 약관 분석으로 숨겨진 독소조항을 찾아냅니다.',
    icon: Search,
    url: '/review-request'
  },
  {
    title: '사이트 등급',
    description: '주요 웹사이트의 약관을 평가하고 등급을 매깁니다.',
    icon: Shield,
    url: '/site-analysis'
  },
  {
    title: '약관 생성',
    description: '기업을 위한 맞춤형 약관 생성 서비스를 제공합니다.',
    icon: FileText,
    url: '/create-terms'
  },
  {
    title: 'AI 챗봇',
    description: '약관 관련 질문에 즉시 답변해 드립니다.',
    icon: Bot,
    url: '/ai-chatbot'
  }
];

export default function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 3;
  const { user } = useUser();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + slidesToShow;
      return newIndex < topWebsites.length * 3 - 4 ? newIndex : 0;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - slidesToShow;
      return newIndex >= 0 ? newIndex : topWebsites.length * 3 - 4 - slidesToShow;
    });
  };

  const handleCardClick = (e: React.MouseEvent, url: string) => {
    if (url === '/create-terms' && (!user || user.userType !== 'COMPANY')) {
      e.preventDefault();
      toast({
        title: "접근 제한",
        description: "이 기능은 기업 사용자 전용입니다.",
        variant: "destructive",
      });
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });
  return (
      <section className="h-screen py-12 bg-gray-100 flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col h-full">
          <h3
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6"
              style={{
                paddingTop: 'calc(3vh)',
                marginTop: 'calc(4vh)',
                marginBottom: 'calc(6vh)',
                fontSize: 'calc(1rem + 1vw)',
              }}
          >
            사이트들의 약관의 평가를 한눈에!
          </h3>

          <div className="relative h-[35%] mb-6" {...handlers}>
            <div
                className="flex transition-transform duration-500 h-full"
                style={{
                  transform: `translateX(-${(currentIndex / topWebsites.length) * 100}%)`,
                }}
            >
              {topWebsites.map((website, index) => (
                  <Link
                      key={index}
                      href={isDragging ? "#" : website.link ?? "#"}
                      draggable="false"
                      className="w-1/3 flex-shrink-0 p-8 py-12 border rounded-lg shadow-md bg-white mx-2 cursor-pointer block
              hover:bg-gray-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10">
                        <img
                            src="/TermCompass_logo.png"
                            alt="Example"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <h3 className="text-base font-bold" style={{fontSize: "clamp(16px, 1.5vw, 24px)"}}>
                        {website.name}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* 장점 섹션 */}
                      <div className="w-full overflow-hidden">
                        <h4 className="text-lg font-semibold text-green-600 my-3"
                            style={{fontSize: "clamp(16px, 1.5vw, 24px)"}}>
                          장점
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {website.benefits.map((benefit, i) => (
                              <li key={i} className="truncate lg:whitespace-normal" style={{fontSize: "clamp(16px, 1.5vw, 20px)"}} >{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 단점 섹션 */}
                      <div className="w-full overflow-hidden">
                        <h4 className="text-lg font-semibold text-red-600 my-3"
                            style={{fontSize: "clamp(16px, 1.5vw, 24px)"}}>
                          단점
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {website.drawbacks.map((drawback, i) => (
                              <li key={i} className="truncate lg:whitespace-normal" style={{fontSize: "clamp(16px, 1.5vw, 20px)"}}>{drawback}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>

            <Button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                variant="outline"
                size="icon"
            >
              &lt;
            </Button>
            <Button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                variant="outline"
                size="icon"
            >
              &gt;
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"
               style={{
                 marginBottom: `calc(3vh)`,
                 height: 'calc(35vh)',
               }}>
            {services.map((service, index) => (
                <Link href={service.url} key={index} legacyBehavior>
                  <a
                      onClick={(e) => handleCardClick(e, service.url)}
                      className="h-full"
                      draggable="false"
                  >
                    <div className="flip-card h-full">
                      <div className="flip-card-inner">
                        <Card className="flip-card-front h-full flex flex-col items-center justify-center p-6">
                          <div className="w-16 h-16 mb-4 text-blue-600 flex-shrink-0">
                            <service.icon className="w-full h-full"/>
                          </div>
                          <CardTitle className="text-lg lg:text-xl text-center mb-3 flex-shrink-0 w-full truncate">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-sm lg:text-base text-center w-full overflow-hidden">
                            <div className="truncate lg:whitespace-normal">
                              {service.description}
                            </div>
                          </CardDescription>
                        </Card>
                        <Card className="flip-card-back h-full flex flex-col justify-center items-center p-6">
                          <CardDescription className="text-sm lg:text-base text-center w-full overflow-hidden">
                            <div className="truncate lg:whitespace-normal">
                              {service.description}
                            </div>
                          </CardDescription>
                        </Card>
                      </div>
                    </div>
                  </a>
                </Link>
            ))}
          </div>
        </div>
      </section>
  );
}