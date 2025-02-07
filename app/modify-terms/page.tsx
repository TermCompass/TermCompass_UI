'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/app/components/Layout'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ModifyTerms() {
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const [modificationRequest, setModificationRequest] = useState('')
  const [modifiedContent, setModifiedContent] = useState<string | null>(null)
  const [isModifying, setIsModifying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    router.push("/")
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        // Here you would typically process the PDF file and extract text
        // For this example, we'll just use a dummy text
        setPdfContent("이것은 업로드된 PDF 파일의 내용입니다. 실제 구현에서는 PDF에서 추출한 텍스트가 여기에 표시됩니다.")
        setModifiedContent(null)
        toast({
          title: "파일 업로드 성공",
          description: "PDF 파일이 성공적으로 업로드되었습니다.",
        })
      } else {
        toast({
          title: "파일 형식 오류",
          description: "PDF 파일만 업로드 가능합니다.",
          variant: "destructive"
        })
      }
    }
  }

  const handleModificationRequest = () => {
    if (!pdfContent) {
      toast({
        title: "수정 요청 실패",
        description: "먼저 PDF 파일을 업로드해주세요.",
        variant: "destructive"
      })
      return
    }

    setIsModifying(true)
    // Here you would typically send the content and modification request to your AI model
    // For this example, we'll just append the modification request to the original content
    setTimeout(() => {
      setModifiedContent(`${pdfContent}\n\n수정된 내용:\n${modificationRequest}에 따라 약관이 수정되었습니다.`)
      setIsModifying(false)
      toast({
        title: "수정 완료",
        description: "AI 모델이 약관을 수정하였습니다.",
      })
    }, 2000)
  }

  const handleReviewRequest = () => {
    if (!modifiedContent) {
      toast({
        title: "검토 요청 실패",
        description: "먼저 약관을 수정해주세요.",
        variant: "destructive"
      })
      return
    }

    // Navigate to the review result page
    router.push(`/modify-terms/review-result?terms=${encodeURIComponent(modifiedContent)}`)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">약관 수정 및 저장</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Button className="bg-black text-white hover:bg-blue-600" onClick={() => fileInputRef.current?.click()}>
              PDF 업로드
            </Button>
          </div>
          {pdfContent && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">업로드된 약관 내용</h2>
              <ScrollArea className="h-[200px] border p-4 rounded">
                <p>{pdfContent}</p>
              </ScrollArea>
            </div>
          )}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">수정 요청 사항</h2>
            <Textarea 
              value={modificationRequest} 
              onChange={(e) => setModificationRequest(e.target.value)}
              placeholder="수정하고 싶은 내용을 입력하세요..."
              className="h-20"
            />
          </div>
          <Button 
            onClick={handleModificationRequest} 
            className="mb-4 bg-black text-white hover:bg-blue-600"
            disabled={isModifying}
          >
            {isModifying ? '수정 중...' : '수정 적용'}
          </Button>
          {modifiedContent && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">수정된 약관 내용</h2>
              <ScrollArea className="h-[200px] border p-4 rounded">
                <p>{modifiedContent}</p>
              </ScrollArea>
            </div>
          )}
          {modifiedContent && (
            <Button className="bg-black text-white hover:bg-blue-600" onClick={handleReviewRequest}>검토 요청</Button>
          )}
        </div>
      </div>
    </Layout>
  )
}
