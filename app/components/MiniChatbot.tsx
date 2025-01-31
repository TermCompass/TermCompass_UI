'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, X, Send, Maximize2, Minimize2, User, Building2, Clock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import { useChatbot } from '../contexts/ChatbotContext';

interface Message {
  type: 'bot' | 'user';
  content: string;
  isLink?: boolean;
  link?: string;
  action?: () => void;
}

interface ChatHistory {
  id: string;
  date: string;
  summary: string;
  messages: Message[];
}

const MiniChatbot: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen } = useChatbot();
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  
  const getWelcomeMessage = () => {
    if (!user) return '게스트';
    return user.userType === 'COMPANY' 
      ? `${user}기업회원님` 
      : `${user}회원님`;
  };

  const initialMessages: Message[] = [
    {
      type: 'bot',
      content: `안녕하세요! ${getWelcomeMessage()}, 약관나침반 서비스에 오신 것을 환영합니다.`
    },
    {
      type: 'bot',
      content: '주요 기능을 알아보시겠습니까?',
      isLink: true,
      action: () => handleServiceInfo()
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: '1',
      date: '2024-03-15',
      summary: '약관 생성 서비스 문의',
      messages: [
        { type: 'user', content: '약관 생성은 어떻게 하나요?' },
        { type: 'bot', content: '약관 생성 서비스는 기업회원 전용 서비스입니다...' }
      ]
    },
    // Add more chat histories as needed
  ]);

  // 사용자 상태가 변경될 때마다 메시지 업데이트
  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        content: `안녕하세요! ${getWelcomeMessage()}, 약관나침반 서비스에 오신 것을 환영합니다.`
      },
      {
        type: 'bot',
        content: '주요 기능을 알아보시겠습니까?',
        isLink: true,
        action: () => handleServiceInfo()
      }
    ]);
  }, [user]);

  function handleServiceInfo() {
    const serviceMessages: Message[] = [
      {
        type: 'bot',
        content: '약관나침반의 주요 기능을 소개해드리겠습니다:'
      },
      {
        type: 'bot',
        content: '1. 사이트 등급 분석: 웹사이트의 약관을 분석하여 등급을 제공합니다.',
        isLink: true,
        link: '/site-analysis'
      },
      {
        type: 'bot',
        content: '2. 약관 검토: AI가 약관의 문제점을 검토하고 개선점을 제안합니다.',
        isLink: true,
        link: '/review-request'
      }
    ];

    // 기업회원인 경우에만 약관 생성 기능 추가
    if (user?.userType === 'COMPANY') {
      serviceMessages.push({
        type: 'bot',
        content: '3. 약관 생성: 기업 회원을 위한 맞춤형 약관 생성 서비스를 제공합니다.',
        isLink: true,
        link: '/create-terms'
      });
    } else {
      serviceMessages.push({
        type: 'bot',
        content: '3. 약관 생성: 기업 회원 전용 서비스입니다. 기업회원으로 로그인하시면 이용하실 수 있습니다.',
        isLink: true,
        action: () => {
          toast({
            title: "기업회원 전용 서비스",
            description: "기업회원으로 로그인 후 이용해주세요.",
            variant: "destructive",
          });
        }
      });
    }

    setMessages(prev => [...prev, ...serviceMessages]);
  }

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { type: 'user' as const, content: input };
    const newMessages = [...messages, userMessage];
    
    // 조건 수정(ex. AI 챗봇의 응답 길이가 100자 이상일 때 확장 모드로 전환)
    if (input === '확장') {
      setIsExpanded(true);
    }

    if (input.toLowerCase().includes('기능') || input.toLowerCase().includes('서비스')) {
      handleServiceInfo();
    }

    setMessages(newMessages);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = (history: ChatHistory) => {
    setMessages(history.messages);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isChatbotOpen 
        ? isExpanded 
          ? 'w-[70vw] h-[70vh]' 
          : 'w-80 h-[450px]'
        : 'w-12 h-12'
    }`}>
      {isChatbotOpen && (
        <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 채팅 히스토리 사이드바 */}
          {isExpanded && user && (
            <div className="w-64 bg-gray-50/80 backdrop-blur-sm border-r border-gray-100">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  이전 대화 기록
                </h3>
                <div className="space-y-2">
                  {chatHistories.map((history) => (
                    <div
                      key={history.id}
                      onClick={() => loadChatHistory(history)}
                      className="p-3 bg-white/80 backdrop-blur-sm rounded-lg cursor-pointer 
                               hover:bg-blue-50 transition-all duration-200 border border-gray-100
                               hover:border-blue-200"
                    >
                      <div className="text-xs text-gray-500">{history.date}</div>
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {history.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 메인 챗봇 영역 */}
          <div className={`flex flex-col h-full flex-grow bg-white`}>
            {/* 챗봇 헤더 */}
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold">약관나침반 도우미</span>
                {user && (
                  <div className="flex items-center gap-1 bg-blue-500 px-2 py-1 rounded-full text-xs">
                    {user.userType === 'COMPANY' ? (
                      <Building2 size={12} />
                    ) : (
                      <User size={12} />
                    )}
                    {user.userType === 'COMPANY' ? '기업회원' : '개인회원'}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {isExpanded ? (
                  <Minimize2 className="cursor-pointer" onClick={() => setIsExpanded(false)} />
                ) : (
                  <Maximize2 className="cursor-pointer" onClick={() => setIsExpanded(true)} />
                )}
                <X className="cursor-pointer" onClick={() => setIsChatbotOpen(false)} />
              </div>
            </div>

            {/* 메시지 영역 */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isExpanded && user && messages.length > 2 && (
                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Maximize2 size={12} />
                    이전 대화 기록 보기
                  </button>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    } ${(message.isLink || message.action) ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => {
                      if (message.link) {
                        router.push(message.link);
                      } else if (message.action) {
                        message.action();
                      }
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 영역 */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full 
                   flex items-center justify-center hover:from-blue-700 hover:to-blue-600 
                   transition-all duration-300 shadow-lg"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default MiniChatbot; 