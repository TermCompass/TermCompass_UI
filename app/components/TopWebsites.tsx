import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {useEffect, useState} from "react";

interface Website {
  name: string;
  logo: string;
  benefits: string[];
  drawbacks: string[];
  link: string;
}

export const topWebsites: Website[] = [
    {
      name: '네이버',
      logo: '/site-logo/naver_logo.png',
      benefits: ['개인정보 보호 강화', '서비스 이용 편의성', '콘텐츠 권리 보장'],
      drawbacks: ['데이터 수집 범위', '서비스 중단 가능성', '계정 삭제 절차'],
      link: '/site-analysis/naver'
    },
    {
      name: '카카오',
      logo: '/site-logo/kakao_logo.png',
      benefits: ['통합 로그인 기능', '서비스 연동 용이성', '보안 정책 강화'],
      drawbacks: ['광고 타겟팅', '제3자 정보 제공', '서비스 변경 권한'],
      link: '/site-analysis/kakao'
    },
    {
      name: '쿠팡',
      logo: '/site-logo/coupang_logo.png',
      benefits: ['반품 정책', '배송 서비스', '회원 혜택'],
      drawbacks: ['개인정보 활용 범위', '분쟁 해결 절차', '가격 정책 변경'],
      link: '/site-analysis/coupang'
    },
    {
      name: '11번가',
      logo: '/site-logo/11st_logo.png',
      benefits: ['상품 품질 보증', '개인정보 이용 내역 조회', '청약철회 기간'],
      drawbacks: ['포인트 소멸 정책', '판매자-구매자 분쟁 중재', '서비스 이용 제한'],
      link: '/site-analysis/11st'
    },
    {
      name: '요기요',
      logo: '/site-logo/yogiyo_logo.jpg',
      benefits: ['음식점 위생 정보 제공', '주문 취소 및 환불 절차', '개인정보 제공 내역 공개'],
      drawbacks: ['리뷰 삭제 정책', '고객-음식점 분쟁 책임', '할인 쿠폰 제한'],
      link: '/site-analysis/yogiyo'
    },
    {
      name: 'G마켓',
      logo: '/site-logo/gmarket_logo.png',
      benefits: ['구매자 보호 정책', '다양한 결제 옵션', '적립금 제도'],
      drawbacks: ['판매자 귀책사유 면책 조항', '개인정보 활용 범위', '서비스 중단 보상 제한'],
      link: '/site-analysis/gmarket'
    },
    {
      name: '배달의민족',
      logo: '/site-logo/baemin_logo.png',
      benefits: ['주문 취소 및 환불 정책', '고객 리뷰 시스템', '개인정보 보호 정책'],
      drawbacks: ['가격 정책 변경 권한', '배달 지연에 대한 책임 제한', '분쟁 해결 절차'],
      link: '/site-analysis/baemin',
    },
    {
      name: '당근마켓',
      logo: '/site-logo/daangn_logo.png',
      benefits: ['지역 기반 거래 시스템', '사용자 간 직거래 지원', '간편한 판매글 등록'],
      drawbacks: ['거래 사기 책임 제한', '개인정보 노출 위험', '분쟁 중재 한계'],
      link: '/site-analysis/daangn',
    },

    {
      name: '번개장터',
      logo: '/site-logo/bunjang_logo.png',
      benefits: ['간편한 중고거래 시스템', '안전결제 서비스', '실시간 채팅 기능'],
      drawbacks: ['허위매물 관리 한계', '개인간 거래 분쟁 해결', '계정 제재 기준'],
      link: '/site-analysis/bunjang'
    },
    {
      name: '야놀자',
      logo: '/site-logo/yanolja_logo.png',
      benefits: ['실시간 예약 시스템', '다양한 숙박 옵션', '포인트 적립 제도'],
      drawbacks: ['취소 및 환불 정책', '숙소 정보 책임 제한', '프로모션 적용 조건'],
      link: '/site-analysis/yanolja'
    },
    {
      name: '여기어때',
      logo: '/site-logo/goodchoice_logo.png',
      benefits: ['가격비교 시스템', '쿠폰 할인 정책', '회원 등급별 혜택'],
      drawbacks: ['예약 변경 수수료', '리뷰 작성 제한', '개인정보 제3자 제공 범위'],
      link: '/site-analysis/goodchoice'
    }
  ]

export default function TopWebsites() {
  const [websites, setWebsites] = useState<Website[]>(topWebsites)

  useEffect(() => {
      const fetchWebsites = async () => {
        try {
          const response = await fetch("http://localhost:8080/site")
          if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.")

          const data: Website[] = await response.json()
          setWebsites(data)
        } catch (error) {
          console.error(error)
        }
      }

      fetchWebsites()
   }, [])

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">인기 사이트 약관 분석</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topWebsites.map((site) => (
          <Link href={site.link} key={site.name}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    <Image
                      src={site.logo}
                      alt={`${site.name} 로고`}
                      width={40}
                      height={40}
                      className="object-contain w-auto h-auto"
                    />
                  </div>
                  <CardTitle>{site.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-green-600">주요 이점</h3>
                  <ul className="list-disc list-inside">
                    {site.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600">주의 사항</h3>
                  <ul className="list-disc list-inside">
                    {site.drawbacks.map((drawback, index) => (
                      <li key={index}>{drawback}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

