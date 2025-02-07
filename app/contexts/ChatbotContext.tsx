'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ChatbotContextType {
  isChatbotOpen: boolean
  setIsChatbotOpen: (isOpen: boolean) => void
  chatbotStatus: string
  setChatbotStatus: (status: string) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [chatbotStatus, setChatbotStatus] = useState('idle')

  return (
    <ChatbotContext.Provider value={{ isChatbotOpen, setIsChatbotOpen, chatbotStatus, setChatbotStatus }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}