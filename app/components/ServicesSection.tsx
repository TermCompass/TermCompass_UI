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
import { useChatbot } from '@/app/contexts/ChatbotContext';
import Image from "next/image";

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
  const { setIsChatbotOpen } = useChatbot();

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
    if (url === '/ai-chatbot') {
      e.preventDefault();
      setIsChatbotOpen(true);
    } else if (url === '/create-terms' && (!user || user.userType !== 'COMPANY')) {
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
                      className="w-1/3 flex-shrink-0 p-4 border rounded-lg shadow-md bg-white mx-2 overflow-hidden flex flex-col transition-transform duration-200 hover:shadow-lg hover:bg-gray-200"
                      style={{
                          height: 'calc(30vh)',
                      }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                        <Image
                            src={website.logo}
                            alt={`${website.name} 로고`}
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <h3 className="text-sm font-bold truncate" 
                            style={{fontSize: "clamp(14px, 1.2vw, 18px)"}}>
                            {website.name}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        <div className="w-full">
                            <h4 className="text-sm font-semibold text-green-600 mb-1" 
                                style={{fontSize: "clamp(12px, 1.1vw, 16px)"}}>
                                유리
                            </h4>
                            <ul className="list-disc list-inside">
                                {website.benefits.slice(0, 2).map((benefit, i) => (
                                    <li key={i} 
                                        className="truncate text-xs text-gray-700" 
                                        style={{fontSize: "clamp(10px, 1vw, 14px)"}}
                                        title={benefit}>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full">
                            <h4 className="text-sm font-semibold text-red-600 mb-1"
                                style={{fontSize: "clamp(12px, 1.1vw, 16px)"}}>
                                불리
                            </h4>
                            <ul className="list-disc list-inside">
                                {website.drawbacks.slice(0, 2).map((drawback, i) => (
                                    <li key={i} 
                                        className="truncate text-xs text-gray-700"
                                        style={{fontSize: "clamp(10px, 1vw, 14px)"}}
                                        title={drawback}>
                                        {drawback}
                                    </li>
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
                          <CardDescription className="text-sm  lg:text-base text-center w-full overflow-hidden">
                            <div className="truncate text-black lg:whitespace-normal">
                              {service.description}
                            </div>
                          </CardDescription>
                        </Card>
                        <Card className="flip-card-back h-full flex flex-col justify-center items-center p-6">
                          <CardDescription className="text-sm lg:text-base text-center w-full overflow-hidden">
                            <div className="truncate text-black lg:whitespace-normal">
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