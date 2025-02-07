'use client'

import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import ChatSidebar from '../components/ChatSidebar'
import { useUser } from '../contexts/UserContext'
import { useRouter } from "next/navigation"

const dummyResponses = [
  "약관의 중요성은 계약 당사자 간의 권리와 의무를 명확히 하는 데 있습니다.",
  "독소조항이란 한쪽에게만 유리하고 다른 쪽에게 불리한 조항을 말합니다.",
  "약관규제법에 따르면, 고객에게 부당하게 불리한 조항은 무효입니다.",
  "개인정보 처리방침은 개인정보보호법에 따라 반드시 포함해야 하는 항목들이 있습니다.",
  "약관 변경 시 고객에게 적절한 고지를 하는 것이 중요합니다.",
  "서울고등법원 2022나1234567 판결에 따르면, 이러한 유형의 조항은 무효로 판단될 수 있습니다.",
  "대법원 2021다987654 판결을 참고하시면, 이 조항의 해석에 도움이 될 것 같습니다."
]

export default function AIChatbot() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page when trying to access this page
    router.push("/")
  }, [router])

  // Original code:
  // const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([])
  // const [input, setInput] = useState('')
  // const fileInputRef = useRef<HTMLInputElement>(null)
  // const { toast } = useToast()
  // const { user } = useUser()

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!input.trim()) return

  //   const newMessages = [
  //     ...messages,
  //     { role: 'user', content: input },
  //     { role: 'bot', content: dummyResponses[Math.floor(Math.random() * dummyResponses.length)] }
  //   ]
  //   setMessages(newMessages)
  //   setInput('')
  // }

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     if (file.type === 'application/pdf') {
  //       // Here you would typically process the PDF file
  //       // For now, we'll just add a message to the chat
  //       const newMessages = [
  //         ...messages,
  //         { role: 'user', content: `파일 업로드: ${file.name}` },
  //         { role: 'bot', content: "PDF 파일을 성공적으로 업로드했습니다. 약관 내용을 분석 중입니다..." }
  //       ]
  //       setMessages(newMessages)
  //     } else {
  //       toast({
  //         title: "파일 형식 오류",
  //         description: "PDF 파일만 업로드 가능합니다.",
  //         variant: "destructive"
  //       })
  //     }
  //   }
  // }

  // const handleSelectChat = (chatId: number) => {
  //     // In a real application, you would fetch the chat history for the selected chat
  //     // For now, we'll just clear the messages if a new chat is selected
  //     if (chatId === -1) {
  //       setMessages([])
  //     } else {
  //       // Simulating loading a previous chat
  //       setMessages([
  //         { role: 'user', content: '이전 채팅 내용입니다.' },
  //         { role: 'bot', content: '네, 이전 채팅 내용을 불러왔습니다.' }
  //       ])
  //     }
  // }

  // useEffect(() => {
  //   const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
  //   if (scrollArea) {
  //     scrollArea.scrollTop = scrollArea.scrollHeight;
  //   }
  // }, [messages])

  // Return null to prevent any flash of content
  return null;
  // return (
  //   <Layout>
  //     <div className="flex h-[calc(100vh-200px)] p-4">
  //       {user && <ChatSidebar onSelectChat={handleSelectChat} />}
  //       <div className="flex-grow flex flex-col">
  //         <h1 className="text-3xl font-bold mb-6 ml-20 text-blue-800 p-4">AI 챗봇</h1>
  //         <div className="flex-grow bg-white rounded-lg shadow-md flex flex-col overflow-hidden mx-20">
  //           <ScrollArea className="flex-grow p-4">
  //             {messages.map((message, index) => (
  //               <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
  //                 <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
  //                   {message.content}
  //                 </span>
  //               </div>
  //             ))}
  //           </ScrollArea>
  //           <form onSubmit={handleSubmit} className="p-4 border-t">
  //             <div className="flex gap-2">
  //               <Input
  //                 type="text"
  //                 value={input}
  //                 onChange={(e) => setInput(e.target.value)}
  //                 placeholder="약관에 대해 질문하세요..."
  //                 className="flex-grow"
  //               />
  //               <Button className="bg-black text-white hover:bg-blue-600" type="submit">전송</Button>
  //               <input
  //                 type="file"
  //                 accept=".pdf"
  //                 ref={fileInputRef}
  //                 onChange={handleFileUpload}
  //                 style={{ display: 'none' }}
  //               />
  //               <Button className="bg-black text-white hover:bg-blue-600" type="button" onClick={() => fileInputRef.current?.click()}>
  //                 PDF 업로드
  //               </Button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </Layout>
  // )
}
