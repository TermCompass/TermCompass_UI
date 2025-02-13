// `TermCompass_UI/app/page.tsx`
'use client'

import { useEffect, useRef, useState } from 'react'

import Layout from './components/Layout'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import NewsAndNoticeSection from './components/NewsAndNoticeSection'
import FooterSection from './components/FooterSection'
import SectionNavigation from './components/SectionNavigation'
import MiniChatbot from './components/MiniChatbot'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const isScrollingRef = useRef(false)
  const lastWheelEventRef = useRef<number>(0)

  // 키보드 이벤트 처리를 위한 상태
  const isTransitioningRef = useRef(false)
  const TRANSITION_DELAY = 1000 // 애니메이션 지속 시간과 동일하게 설정

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const currentTime = Date.now()
      if (currentTime - lastWheelEventRef.current < 50) return
      lastWheelEventRef.current = currentTime

      if (isScrollingRef.current) return

      const delta = e.deltaY
      if (Math.abs(delta) < 50) return

      if (delta > 0 && activeSection < 3) {
        scrollToSection(activeSection + 1)
      } else if (delta < 0 && activeSection > 0) {
        scrollToSection(activeSection - 1)
      }
    }

    container.addEventListener('wheel', handleWheel)
    return () => container.removeEventListener('wheel', handleWheel)
  }, [activeSection])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current) return
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        
        if (e.key === 'ArrowDown' && activeSection < 3) {
          scrollToSection(activeSection + 1)
        } else if (e.key === 'ArrowUp' && activeSection > 0) {
          scrollToSection(activeSection - 1)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection])

  const scrollToSection = (index: number) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true

    isScrollingRef.current = true
    setActiveSection(index)

    // URL 해시 업데이트
    const sectionIds = ['hero', 'services', 'news', 'footer']
    window.location.hash = sectionIds[index]

    setTimeout(() => {
      isScrollingRef.current = false
      isTransitioningRef.current = false
    }, TRANSITION_DELAY)
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
      <MiniChatbot />
    </Layout>
  )
}