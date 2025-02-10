'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

const getBackgroundColor = (rating: string) => {
  switch (rating) {
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
    rating: 'E',
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
    rating: 'D',
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
          </div>
          <Badge className={`ml-auto text-lg font-bold ${getBackgroundColor(site.rating)}`}>{site.rating}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-600">유리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">불리한 조항</h3>
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
