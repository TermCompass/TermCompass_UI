'use client'

import { useParams, useRouter } from 'next/navigation'
import Layout from '../../components/Layout'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

const dummySiteData = {
  'naver.com': {
    name: '네이버',
    logo: '/site-logo/naver_logo.png',
    domain: 'naver.com',
    rating: 'A',
    info: '대한민국의 대표적인 포털 사이트',
    unfavorableClauses: [
      '서비스 중단 시 보상 제한',
      '개인정보 제3자 제공 범위',
      '콘텐츠 권리 양도'
    ],
    favorableClauses: [
      '개인정보 보호 정책 강화',
      '서비스 이용 편의성 개선',
      '계정 삭제 요청 처리 기간 단축'
    ],
    neutralClauses: [
      '서비스 이용 연령 제한',
      '광고 게재에 관한 사항',
      '준거법 및 관할 법원'
    ]
  },
  'kakao.com': {
    name: '카카오',
    logo: '/site-logo/kakao_logo.png',
    domain: 'kakao.com',
    rating: 'B',
    info: '모바일 메신저를 기반으로 한 종합 IT 플랫폼',
    unfavorableClauses: [
      '서비스 해지 시 데이터 복구 불가',
      '광고성 정보 수신 동의 기본값',
      '분쟁 해결 비용 사용자 부담'
    ],
    favorableClauses: [
      '개인정보 암호화 및 보안 강화',
      '서비스 간 연동 기능',
      '청소년 보호 정책'
    ],
    neutralClauses: [
      '서비스 점검 및 중단에 관한 사항',
      '지적재산권 관련 규정',
      '서비스 변경 및 중지에 관한 사항'
    ]
  },
  'coupang.com': {
    name: '쿠팡',
    logo: '/site-logo/coupang_logo.png',
    domain: 'coupang.com',
    rating: 'B',
    info: '대한민국의 대표적인 이커머스 플랫폼',
    unfavorableClauses: [
      '판매자 귀책사유로 인한 분쟁 시 책임 제한',
      '적립금 및 쿠폰의 유효기간',
      '회원 탈퇴 시 개인정보 보유'
    ],
    favorableClauses: [
      '소비자 보호 정책 강화',
      '반품 및 환불 절차 간소화',
      '개인정보 유출 시 즉시 통지'
    ],
    neutralClauses: [
      '상품 정보 제공에 관한 사항',
      '배송 지연에 대한 보상 규정',
      '해외 직구 관련 규정'
    ]
  },
  '11st.co.kr': {
    name: '11번가',
    logo: '/site-logo/11st_logo.png',
    domain: '11st.co.kr',
    rating: 'B',
    info: 'SK그룹의 대표적인 온라인 쇼핑몰',
    unfavorableClauses: [
      '포인트 소멸 정책',
      '판매자와 구매자 간 분쟁 시 중재 범위 제한',
      '서비스 이용 제한에 대한 재량권'
    ],
    favorableClauses: [
      '상품 품질 보증 정책',
      '개인정보 이용 내역 조회 기능',
      '청약철회 기간 연장'
    ],
    neutralClauses: [
      '결제 수단에 관한 사항',
      '이벤트 및 프로모션 운영 규정',
      '해외 배송 관련 규정'
    ]
  },
  'yogiyo.co.kr': {
    name: '요기요',
    logo: '/site-logo/yogiyo_logo.jpg',
    domain: 'yogiyo.co.kr',
    rating: 'C',
    info: '대한민국의 대표적인 음식 배달 플랫폼',
    unfavorableClauses: [
      '리뷰 삭제에 대한 플랫폼의 재량권',
      '고객과 음식점 간 분쟁 시 책임 제한',
      '할인 쿠폰 사용 제한 사항'
    ],
    favorableClauses: [
      '음식점 위생 정보 제공',
      '주문 취소 및 환불 절차 명시',
      '개인정보 제3자 제공 내역 공개'
    ],
    neutralClauses: [
      '배달 지연에 대한 보상 규정',
      '주문 대행 서비스 이용 약관',
      '결제 방식에 관한 사항'
    ]
  },
  'gmarket.co.kr': {
    name: 'G마켓',
    logo: '/site-logo/gmarket_logo.png',
    domain: 'gmarket.co.kr',
    rating: 'B',
    info: '이베이코리아가 운영하는 대형 온라인 쇼핑몰',

    unfavorableClauses: [
      '판매자 귀책사유에 대한 플랫폼의 면책 조항',
      '개인정보 활용 범위의 광범위성',
      '서비스 중단 시 보상 제한'
    ],
    favorableClauses: [
      '구매자 보호 정책 강화',
      '다양한 결제 옵션 제공',
      '적립금 제도의 유연성'
    ],
    neutralClauses: [
      '해외 직구 관련 규정',
      '상품 정보 제공 책임',
      '분쟁 해결 절차'
    ]
  },
  'baemin.com': {
    name: '배달의민족',
    logo: '/site-logo/baemin_logo.png',
    domain: 'baemin.com',
    rating: 'B',
    info: '국내 최대 규모의 음식 배달 애플리케이션',

    unfavorableClauses: [
      '가격 정책 변경에 대한 광범위한 권한',
      '배달 지연에 대한 책임 제한',
      '리뷰 삭제 정책의 모호성'
    ],
    favorableClauses: [
      '주문 취소 및 환불 정책의 명확성',
      '고객 리뷰 시스템의 투명성',
      '개인정보 보호 정책 강화'
    ],
    neutralClauses: [
      '음식점 등록 및 관리 정책',
      '프로모션 및 쿠폰 사용 규정',
      '배달 기사 관련 규정'
    ]
  },
  'tmon.co.kr': {
    name: '티몬',
    logo: '/site-logo/tmon_logo.png',
    domain: 'tmon.co.kr',
    rating: 'C',

    info: '소셜커머스 기반의 온라인 쇼핑 플랫폼',
    unfavorableClauses: [
      '상품 정보에 대한 책임 제한',
      '개인정보 제3자 제공 범위의 광범위성',
      '적립금 소멸 정책의 불리함'
    ],
    favorableClauses: [
      '쿠폰 및 할인 정책의 다양성',
      '간편 결제 시스템 제공',
      '고객 서비스 채널의 접근성'
    ],
    neutralClauses: [
      '회원 등급 제도',
      '상품평 작성 규정',
      '결제 취소 및 환불 절차'
    ]
  },
  'wemakeprice.com': {
    name: '위메프',
    logo: '/site-logo/wemakeprice_logo.png',
    domain: 'wemakeprice.com',
    rating: 'C',

    info: '다양한 상품을 할인된 가격에 제공하는 이커머스 플랫폼',
    unfavorableClauses: [
      '계정 해지 절차의 복잡성',
      '환불 처리 기간의 장기화',
      '분쟁 해결 시 소비자 부담 가능성'
    ],
    favorableClauses: [
      '가격 비교 시스템의 투명성',
      '무료 배송 정책의 명확성',
      '정기 구독 서비스의 유연성'
    ],
    neutralClauses: [
      '상품 품절 시 처리 방침',
      '적립금 사용 규정',
      '이벤트 참여 조건'
    ]
  },
  'daangn.com': {
    name: '당근마켓',
    logo: '/site-logo/daangn_logo.png',
    domain: 'daangn.com',
    rating: 'B',

    info: '위치 기반 중고 거래 플랫폼',
    unfavorableClauses: [
      '거래 사기에 대한 플랫폼 책임 제한',
      '개인정보 노출 위험에 대한 경고 부족',
      '분쟁 발생 시 중재 역할의 한계'
    ],
    favorableClauses: [
      '지역 기반 거래 시스템의 편의성',
      '사용자 간 직거래 지원 정책',
      '간편한 판매글 등록 절차'
    ],
    neutralClauses: [
      '커뮤니티 이용 규칙',
      '광고 및 홍보 관련 정책',
      '계정 인증 절차'
    ]
  },
  'interpark.com': {
    name: '인터파크',
    logo: '/site-logo/interpark_logo.png',
    domain: 'interpark.com',
    rating: 'B',

    info: '여행, 티켓, 쇼핑 등 종합 서비스를 제공하는 플랫폼',
    unfavorableClauses: [
      '취소 수수료 정책의 엄격성',
      '개인정보 보유 기간의 장기화',
      '서비스 변경 고지 방식의 불명확성'
    ],
    favorableClauses: [
      '통합 예약 시스템의 편의성',
      '다양한 카테고리 서비스 제공',
      '멤버십 혜택의 다양성'
    ],
    neutralClauses: [
      '해외 여행 관련 규정',
      '티켓 예매 규칙',
      '할인 쿠폰 사용 조건'
    ]
  },
  'lotteon.com': {
    name: '롯데온',
    logo: '/site-logo/lotteon_logo.png',
    domain: 'lotteon.com',
    rating: 'B',
    info: '롯데그룹의 통합 온라인 쇼핑 플랫폼',

    unfavorableClauses: [
      '온라인 전용 상품의 교환 제한',
      '멤버십 등급 조정 기준의 불투명성',
      '개인정보 마케팅 활용 범위의 광범위성'
    ],
    favorableClauses: [
      '통합 포인트 시스템의 편의성',
      '오프라인 매장과의 연계 서비스',
      '프리미엄 회원 혜택의 다양성'
    ],
    neutralClauses: [
      '상품평 작성 및 관리 정책',
      '배송 지연 보상 규정',
      '결제 수단별 이용 조건'
    ]
  },
  'bunjang.co.kr': {
    name: '번개장터',
    logo: '/site-logo/bunjang_logo.png',
    domain: 'bunjang.co.kr',
    rating: 'C',

    info: '중고 거래 중심의 온라인 플랫폼',
    unfavorableClauses: [
      '허위매물 관리의 한계',
      '개인간 거래 분쟁 해결의 어려움',
      '계정 제재 기준의 모호성'
    ],
    favorableClauses: [
      '간편한 중고거래 시스템 제공',
      '안전결제 서비스 운영',
      '실시간 채팅 기능 지원'
    ],
    neutralClauses: [
      '판매 금액 제한 정책',
      '프로필 인증 제도',
      '광고 상품 이용 규정'
    ]
  },
  'yanolja.com': {
    name: '야놀자',
    logo: '/site-logo/yanolja_logo.png',
    domain: 'yanolja.com',
    rating: 'B',

    info: '숙박 및 레저 중심의 종합 여가 플랫폼',
    unfavorableClauses: [
      '취소 및 환불 정책의 엄격성',
      '숙소 정보 책임의 제한',
      '프로모션 적용 조건의 복잡성'
    ],
    favorableClauses: [
      '실시간 예약 시스템의 편의성',
      '다양한 숙박 옵션 제공',
      '포인트 적립 제도의 유연성'
    ],
    neutralClauses: [
      '연령 제한 정책',
      '리뷰 작성 규정',
      '파트너사 등록 조건'
    ]
  },
  'goodchoice.kr': {
    name: '여기어때',
    logo: '/site-logo/goodchoice_logo.png',
    domain: 'goodchoice.kr',
    rating: 'B',
    info: '국내 숙박 예약 중심의 여행 플랫폼',
    unfavorableClauses: [
      '예약 변경 수수료 정책',
      '리뷰 작성 제한 사항',
      '개인정보 제3자 제공 범위의 광범위성'
    ],
    favorableClauses: [
      '가격비교 시스템의 투명성',
      '쿠폰 할인 정책의 다양성',
      '회원 등급별 혜택 제공'
    ],
    neutralClauses: [
      '숙소 등급 평가 기준',
      '예약 확정 및 취소 규정',
      '결제 수단별 이용 조건'
    ]
  }
}

export default function SiteEvaluation() {
  const params = useParams()
  const router = useRouter()
  const domain = params.domain as string
  const site = dummySiteData[domain]

  if (!site) {
    return <div>Site not found</div>
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">{site.name} 약관 평가</h1>
            <Button
                onClick={() => router.back()}
                variant="outline"
            >
                돌아가기
            </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <div className="w-[100px] h-[100px] border-2 border-gray-300 rounded-lg overflow-hidden mr-4 flex items-center justify-center p-3">
              <Image 
                src={site.logo} 
                alt={`${site.name} 로고`} 
                width={80} 
                height={80} 
                className="object-contain w-auto h-auto max-w-[70px] max-h-[70px]" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{site.name}</h2>
              <p className="text-blue-600">{site.domain}</p>
              <p className="text-xl font-bold mt-2">등급: {site.rating}</p>
            </div>
          </div>
          <p className="text-gray-700">{site.info}</p>
        </div>

        <div className="grid grid-rows-1 md:grid-rows-3 gap-6 mb-6">
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">소비자에게 불리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.neutralClauses.map((clause: string, index: number) => (
                <li key={index}>{clause}</li>
              ))}
            </ul>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">소비자에게 유리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.neutralClauses.map((clause: string, index: number) => (
                <li key={index}>{clause}</li>
              ))}
            </ul>
          </div>

          {false && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">중립적인 조항</h3>
                <ul className="list-disc list-inside">
                  {site.neutralClauses.map((clause: string, index: number) => (
                      <li key={index}>{clause}</li>
                  ))}
                </ul>
              </div>
          )}

        </div>
        {false && (
          <Button className="bg-black text-white hover:bg-blue-600" onClick={() => router.push(`/site-analysis/${domain}/history`)}>
            등급 판정 이력 보기
          </Button>
        )}
      </div>
    </Layout>
  )
}

