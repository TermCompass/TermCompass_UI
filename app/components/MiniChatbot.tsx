'use client'

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, User, Building2, Clock, ArrowRight, AlertCircle, FileText, UserPlus, BarChart2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import { useChatbot } from '../contexts/ChatbotContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface Request {
  request: string;
  answer: string;
}

interface ChatHistory {
  id: string;
  recordType: string;
  result: string;
  requests: Request[];
}

const MiniChatbot: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen } = useChatbot();
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Request[]>([]);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);
  const router = useRouter();
  const { setIsAuthFormOpen, setAuthType } = useAuth();

  const userId = user?.email || 'guest';

  // 고정 질문과 응답
  const fixedOptions = [
    {
      key: '약관 생성',
      response: 'AI 기반 맞춤형 약관 생성 서비스를 이용해보세요.',
      path: '/create-terms',
      requiresAuth: true,
      requiresCompany: true,
      icon: Building2,
      action: () => {
        // 챗봇을 닫지 않고 설명과 로그인 유도 메시지 출력
        setMessages((prev) => [
          ...prev,
          { request: '', answer: '약관 생성 서비스는 기업회원 전용입니다. 로그인 하시겠습니까?' },
        ]);
      }
    },
    {
      key: '약관 검토',
      response: 'AI가 약관의 문제점을 검토하고 개선점을 제안합니다.',
      path: '/review-request',
      requiresAuth: false,
      icon: FileText,
      action: () => {
        setMessages((prev) => [
          ...prev,
          { request: '', answer: '약관 검토 서비스에 오신 것을 환영합니다.' },
        ]);
      }
    },
    {
      key: '사이트 등급 확인',
      response: '주요 웹사이트의 약관을 분석하여 등급을 제공합니다.',
      path: '/site-analysis',
      requiresAuth: false,
      icon: BarChart2,
      action: () => {
        setMessages((prev) => [
          ...prev,
          { request: '', answer: '사이트 등급 확인 서비스에 오신 것을 환영합니다.' },
        ]);
      }
    },
    {
      key: '회원가입 및 로그인',
      response: '회원가입은 홈페이지에서 가능합니다.',
      description: '회원가입하고 더 많은 서비스를 이용하세요.',
      path: '/signup',
      requiresAuth: false,
      icon: UserPlus,
      action: () => {
        setIsChatbotOpen(false);
        requestAnimationFrame(() => {
          setIsAuthFormOpen(true);  // 회원가입 폼 열기
        });
      }
    },
  ];

  // 초기 시스템 메시지 설정
  useEffect(() => {
    // 메시지가 없거나 로그인 상태가 변경되었을 때 초기 메시지 설정
    const systemMessage: Request = {
      request: '',
      answer: user ? '궁금한 내용을 입력해 주세요.' : '다음 중 원하는 서비스를 선택하세요:',
    };

    setMessages([systemMessage]);
    setSelectedOptionKey(null); // 선택된 옵션도 초기화

  }, [user]); // user 상태 변화를 감지

  // 고정 선택지 클릭 시 응답 처리
  const handleOptionSelect = (optionKey: string) => {
    const selectedOption = fixedOptions.find(opt => opt.key === optionKey);
    if (selectedOption) {
      setSelectedOptionKey(optionKey);

      // action이 있는 경우 실행
      if (selectedOption.action) {
        selectedOption.action();
        return;
      }

      setMessages((prev) => [
        ...prev,
        { request: optionKey, answer: selectedOption.response },
      ]);
    }
  };

  // 로그인/회원가입 버튼 클릭 핸들러 추가
  const handleAuthClick = () => {
    setIsChatbotOpen(false);
    requestAnimationFrame(() => {
      setIsAuthFormOpen(true);
    });
  };

  // 로그인 버튼 클릭 핸들러 추가
  const handleLoginButtonClick = () => {
    setIsChatbotOpen(false);
    requestAnimationFrame(() => {
      setIsAuthFormOpen(true);  // 로그인 폼 열기
    });
  };

  // 메시지 전송 함수
  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { request: input, answer: '' }]);

    if (!user) {
      toast({
        title: '로그인 필요',
        description: '로그인 후에 자유로운 질문이 가능합니다.',
        variant: 'destructive',
      });

      // 고정 선택지 메시지 처리
      if (fixedOptions.some(opt => input.includes(opt.key))) {
        handleOptionSelect(input);
      } else {
        setMessages((prev) => [...prev, { request: '', answer: '다음 중 원하는 서비스를 선택하세요:' }]);
      }

      setInput('');
      return;
    }

    try {
      const response = await fetch('http://kyj9447.ddns.net:8080/create-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: input, userId: userId, recordId: currentRecordId }),
      });

      const data = await response.json();
      setMessages((prev) => {
        const newMessage = { request: input, answer: extractFinalResponse(data.response) };
        return [...prev.slice(0, -1), newMessage]; // 마지막 메시지(answer: '')를 덮어씀
      });

      setCurrentRecordId(data.recordId);
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      setMessages((prev) => [...prev, { request: input, answer: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
    }

    setInput('');
  };

  // 최종 응답 추출 함수
  function extractFinalResponse(response: string): string {
    const parts = response.split('답변:');
    return parts.length > 1 ? parts[parts.length - 1].trim() : response;
  }

  // 메시지 입력 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 히스토리 로드 함수
  const loadChatHistory = (history: ChatHistory) => {
    setMessages(history.requests);
  };

  // 히스토리 샘플 데이터 설정
  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://kyj9447.ddns.net:8080/records/${user.id}`);
        if (!response.ok) throw new Error('서버 오류');

        const data = await response.json();

        // recordType이 'CHAT'인 데이터만 필터링
        const chatHistory = data.filter((record: ChatHistory) => record.recordType === "CHAT");

        setHistory(chatHistory);
      } catch (error) {
        console.error('채팅 기록을 불러오는 중 오류 발생:', error);
      }
    };

    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 서비스 이용하기 버튼 클릭 핸들러 추가
  const handleServiceButtonClick = (path: string) => {
    setIsChatbotOpen(false);
    router.push(path);  // 해당 페이지로 이동
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
                  {history.map((historyItem) => (
                    <div
                      key={historyItem.id}
                      onClick={() => loadChatHistory(historyItem)}
                      className="p-3 bg-white/80 rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
                    >
                      <div className="text-sm text-gray-700 line-clamp-2">{historyItem.result}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 border-t bg-white">
                <button
                    onClick={() => {
                      setMessages([])
                      setCurrentRecordId(null);
                    }}  // 기존 메시지 초기화
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  새 채팅
                </button>
              </div>
            </div>
          )}

          {/* 메인 챗봇 영역 */}
          <div className="flex flex-col h-full flex-grow bg-white">
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
              {messages.map((message, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    {/* 사용자 메시지 (오른쪽 정렬) */}
                    {message.request && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] p-3 rounded-lg bg-blue-600 text-white">
                            {message.request}
                          </div>
                        </div>
                    )}

                    {/* 챗봇 응답 (왼쪽 정렬) */}
                    {message.answer && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                            {message.answer}
                          </div>
                        </div>
                    )}
                  </div>
              ))}
              {!user && (
                <div className="flex flex-col space-y-2 mt-2 px-2">
                  {fixedOptions.map((option) => (
                    <div key={option.key} className="space-y-2">
                      <button
                        onClick={() => handleOptionSelect(option.key)}
                        className="w-full p-2 bg-white hover:bg-gray-50 rounded-lg
                                   transition-all text-left border border-gray-100
                                   hover:border-blue-200 hover:shadow-sm group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md
                                         group-hover:bg-blue-100 transition-colors">
                            <option.icon size={16} />
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{option.key}</span>
                        </div>
                      </button>

                      {selectedOptionKey === option.key && (
                        <div className="ml-3 space-y-2">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-gray-50
                                        rounded-lg border border-blue-100">
                            <p className="text-sm text-gray-700">{option.response}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {option.description}
                            </p>

                            {/* 조건부 버튼 렌더링 */}
                            {(!option.requiresAuth || user) &&
                             (!option.requiresCompany) && (
                              <div className="mt-2 flex justify-end">
                                <button
                                  onClick={() => router.push(option.path)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600
                                           text-white rounded-md text-xs hover:bg-blue-700
                                           transition-colors"
                                >
                                  서비스 이용하기
                                  <ArrowRight size={14} />
                                </button>
                              </div>
                            )}

                            {/* 기업회원 전용 서비스 안내 */}
                            {option.requiresCompany && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600
                                            bg-amber-50 p-2 rounded-md border border-amber-100">
                                <AlertCircle size={14} />
                                <span>기업회원 전용 서비스입니다.</span>
                              </div>
                            )}

                            {/* 로그인 필요 안내 */}
                            {option.requiresAuth && !user && (
                              <div className="mt-2 flex justify-between items-center bg-gray-50
                                            p-2 rounded-md border border-gray-200">
                                <span className="text-xs text-gray-600">
                                  로그인이 필요합니다
                                </span>
                                <button
                                  onClick={() => {
                                    setIsChatbotOpen(false);
                                    requestAnimationFrame(() => {
                                      setAuthType('COMPANY');
                                      setIsAuthFormOpen(true);
                                    });
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700
                                           font-medium flex items-center gap-1"
                                >
                                  로그인
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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