'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

const dummySiteRatings = [
  { 
    name: '네이버', 
    logo: '/site-logo/naver_logo.png',
    domain: 'naver.com',
    rating: 'A',
    benefits: ['개인정보 보호 강화', '서비스 이용 편의성', '콘텐츠 권리 보장'],
    drawbacks: ['데이터 수집 범위', '서비스 중단 가능성', '계정 삭제 절차']
  },
  { 
    name: '카카오', 
    logo: '/site-logo/kakao_logo.png', 
    domain: 'kakao.com',
    rating: 'B',
    benefits: ['통합 로그인 기능', '서비스 연동 용이성', '보안 정책 강화'],
    drawbacks: ['광고 타겟팅', '제3자 정보 제공', '서비스 변경 권한']
  },
  { 
    name: '쿠팡', 
    logo: '/site-logo/coupang_logo.png', 
    domain: 'coupang.com',
    rating: 'B',
    benefits: ['반품 정책', '배송 서비스', '회원 혜택'],
    drawbacks: ['개인정보 활용 범위', '분쟁 해결 절차', '가격 정책 변경']
  },
  { 
    name: '11번가', 
    logo: '/site-logo/11st_logo.png', 
    domain: '11st.co.kr',
    rating: 'B',
    benefits: ['상품 품질 보증', '개인정보 이용 내역 조회', '청약철회 기간'],
    drawbacks: ['포인트 소멸 정책', '판매자-구매자 분쟁 중재', '서비스 이용 제한']
  },
  { 
    name: '요기요', 
    logo: '/site-logo/yogiyo_logo.jpg', 
    domain: 'yogiyo.co.kr',
    rating: 'C',
    benefits: ['음식점 위생 정보 제공', '주문 취소 및 환불 절차', '개인정보 제공 내역 공개'],
    drawbacks: ['리뷰 삭제 정책', '고객-음식점 분쟁 책임', '할인 쿠폰 제한']
  },
  { 
    name: 'G마켓', 
    logo: '/site-logo/gmarket_logo.png', 
    domain: 'gmarket.co.kr',
    rating: 'B',
    benefits: ['구매자 보호 정책', '다양한 결제 옵션', '적립금 제도'],
    drawbacks: ['판매자 귀책사유 면책 조항', '개인정보 활용 범위', '서비스 중단 보상 제한']
  },
  { 
    name: '배달의민족', 
    logo: '/site-logo/baemin_logo.png', 
    domain: 'baemin.com',
    rating: 'B',
    benefits: ['주문 취소 및 환불 정책', '고객 리뷰 시스템', '개인정보 보호 정책'],
    drawbacks: ['가격 정책 변경 권한', '배달 지연에 대한 책임 제한', '분쟁 해결 절차']
  },
  { 
    name: '티몬', 
    logo: '/site-logo/tmon_logo.png', 
    domain: 'tmon.co.kr',
    rating: 'C',
    benefits: ['쿠폰 및 할인 정책', '간편 결제 시스템', '고객 서비스 채널'],
    drawbacks: ['상품 정보 책임 제한', '개인정보 제3자 제공', '적립금 소멸 정책']
  },
  { 
    name: '위메프', 
    logo: '/site-logo/wemakeprice_logo.png', 
    domain: 'wemakeprice.com',
    rating: 'C',
    benefits: ['가격 비교 시스템', '무료 배송 정책', '정기 구독 서비스'],
    drawbacks: ['계정 해지 절차', '환불 처리 기간', '분쟁 해결 비용 부담']
  },
  { 
    name: '당근마켓', 
    logo: '/site-logo/daangn_logo.png', 
    domain: 'daangn.com',
    rating: 'B',
    benefits: ['지역 기반 거래 시스템', '사용자 간 직거래 지원', '간편한 판매글 등록'],
    drawbacks: ['거래 사기 책임 제한', '개인정보 노출 위험', '분쟁 중재 한계']
  },
  { 
    name: '인터파크', 
    logo: '/site-logo/interpark_logo.png', 
    domain: 'interpark.com',
    rating: 'B',
    benefits: ['통합 예약 시스템', '다양한 카테고리 제공', '멤버십 혜택'],
    drawbacks: ['취소 수수료 정책', '개인정보 보유 기간', '서비스 변경 고지 방식']
  },
  { 
    name: '롯데온', 
    logo: '/site-logo/lotteon_logo.png', 
    domain: 'lotteon.com',
    rating: 'B',
    benefits: ['통합 포인트 시스템', '오프라인 연계 서비스', '프리미엄 회원 혜택'],
    drawbacks: ['온라인 전용 상품 교환 제한', '멤버십 등급 조정 기준', '개인정보 마케팅 활용']
  },
  { 
    name: '번개장터', 
    logo: '/site-logo/bunjang_logo.png', 
    domain: 'bunjang.co.kr',
    rating: 'C',
    benefits: ['간편한 중고거래 시스템', '안전결제 서비스', '실시간 채팅 기능'],
    drawbacks: ['허위매물 관리 한계', '개인간 거래 분쟁 해결', '계정 제재 기준']
  },
  { 
    name: '야놀자', 
    logo: '/site-logo/yanolja_logo.png', 
    domain: 'yanolja.com',
    rating: 'B',
    benefits: ['실시간 예약 시스템', '다양한 숙박 옵션', '포인트 적립 제도'],
    drawbacks: ['취소 및 환불 정책', '숙소 정보 책임 제한', '프로모션 적용 조건']
  },
  { 
    name: '여기어때', 
    logo: '/site-logo/goodchoice_logo.png', 
    domain: 'goodchoice.kr',
    rating: 'B',
    benefits: ['가격비교 시스템', '쿠폰 할인 정책', '회원 등급별 혜택'],
    drawbacks: ['예약 변경 수수료', '리뷰 작성 제한', '개인정보 제3자 제공 범위']
  }
]

type Grade = 'A' | 'B' | 'C' | 'ALL';

export default function SiteRatings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<Grade>('ALL')

  const filteredRatings = dummySiteRatings.filter(rating =>
    (selectedGrade === 'ALL' || rating.rating === selectedGrade) &&
    (rating.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rating.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const renderSiteCard = (site: typeof dummySiteRatings[0]) => (
    <Link href={`/site-analysis/${site.domain}`} key={site.domain} className="block">
      <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center mb-2">
          <Image src={site.logo} alt={`${site.name} 로고`} width={50} height={50} className="mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{site.name}</h2>
            <p className="text-blue-600">{site.domain}</p>
          </div>
          <Badge variant="outline" className="ml-auto text-lg font-bold">{site.rating}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-600">주요 장점</h3>
            <ul className="list-disc list-inside">
              {site.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">주요 단점</h3>
            <ul className="list-disc list-inside">
              {site.drawbacks.map((drawback, index) => (
                <li key={index}>{drawback}</li>
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
              {(['ALL', 'A', 'B', 'C'] as const).map((grade) => (
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

