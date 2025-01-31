// `TermCompass_UI/app/page.tsx`
'use client'

import { useEffect, useRef, useState } from 'react'

import Layout from './components/Layout'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import NewsAndNoticeSection from './components/NewsAndNoticeSection'
import FooterSection from './components/FooterSection'
import SectionNavigation from './components/SectionNavigation'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const isScrollingRef = useRef(false)
  const lastWheelEventRef = useRef<number>(0)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // 스크롤 중이면 무시
      if (isScrollingRef.current) return

      // 휠 이벤트 쓰로틀링 (연속 이벤트 방지)
      const now = Date.now()
      if (now - lastWheelEventRef.current < 50) return // 50ms 내 연속 이벤트 무시
      lastWheelEventRef.current = now

      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = activeSection + direction

      // 범위 체크
      if (nextSection < 0 || nextSection >= container.children.length) return

      isScrollingRef.current = true
      setActiveSection(nextSection)

      // URL 해시 업데이트
      const sectionIds = ['hero', 'services', 'news', 'footer']
      window.location.hash = sectionIds[nextSection]

      // 부드러운 스크롤 이동
      const targetSection = container.children[nextSection] as HTMLElement
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })

      // 스크롤 완료 대기
      setTimeout(() => {
        isScrollingRef.current = false
      }, 800) // 스크롤 애니메이션 완료 시간
    }

    // passive: false로 설정하여 preventDefault 허용
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [activeSection])

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current
    if (!container || isScrollingRef.current || index === activeSection) return

    isScrollingRef.current = true
    setActiveSection(index)

    const sectionIds = ['hero', 'services', 'news', 'footer']
    window.location.hash = sectionIds[index]

    const targetSection = container.children[index] as HTMLElement
    targetSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })

    setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }

  return (
    <Layout activeSection={activeSection}>
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide pt-20 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div id="hero" className="snap-start h-screen">
          <HeroSection />
        </div>
        <div id="services" className="snap-start h-screen">
          <ServicesSection />
        </div>
        <div id="news" className="snap-start h-screen">
          <NewsAndNoticeSection />
        </div>
        <div id="footer" className="snap-start h-[20vh]">
          <FooterSection />
        </div>
      </div>
      <SectionNavigation activeSection={activeSection} onNavigate={scrollToSection} />
    </Layout>
  )
}