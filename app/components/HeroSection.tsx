'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useChatbot } from '../contexts/ChatbotContext'

const words = ['약관', '개인정보', '서비스', '혁신']

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const { setIsChatbotOpen } = useChatbot()
  const [randomSizes, setRandomSizes] = useState<{ width: number, height: number, top: string, left: string }[]>([])

  // 클라이언트에서만 랜덤 값 생성
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const randomCircles = [...Array(20)].map(() => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }))
    setRandomSizes(randomCircles)

    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
      <section className="relative h-screen flex items-center justify-center text-gray">
        <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="z-10 text-center mb-20">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">
              약관의 미래, 약관나침반과 함께
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl mb-4 sm:mb-6">
              AI 기반
              <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block ml-2 font-semibold"
              >
                {words[currentWord]}
              </motion.span>
              {' '}분석으로 더 나은 디지털 경험을 만듭니다
            </p>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <button
                  onClick={() => setIsChatbotOpen(true)}
                  className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors"
              >
                AI 챗봇 시작하기
              </button>
            </motion.div>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {randomSizes.map((size, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white bg-opacity-10 rounded-full"
                    style={{
                      width: size.width,
                      height: size.height,
                      top: size.top,
                      left: size.left,
                    }}
                    animate={{
                      y: [0, -1000],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'linear',
                    }}
                />
            ))}
          </div>
        </div>
      </section>
  )
}
