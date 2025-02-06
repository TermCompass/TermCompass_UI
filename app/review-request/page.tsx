'use client'

import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReviewSidebar from '../components/ReviewSidebar'
import ReviewResult from '../components/ReviewResult'
import { useUser } from '../contexts/UserContext'
import OriginalDocument from '../components/OriginalDocument'
import pako from 'pako'

export default function ReviewRequest() {
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const [isPdfUploaded, setIsPdfUploaded] = useState(false)
  const [reviewResult, setReviewResult] = useState<string | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [clauseDetails, setClauseDetails] = useState<{ [key: string]: string }>({
    "제7조 2항": "이 조항은 서비스 제공자의 책임을 과도하게 제한하고 있어 소비자의 권리를 침해할 수 있습니다. 관련 법규: 약관규제법 제6조",
    "제12조 1항": "개인정보의 제3자 제공 범위가 불명확하여 개인정보보호법에 위배될 소지가 있습니다. 관련 법규: 개인정보보호법 제17조",
    "제15조 3항": "분쟁 해결 절차가 소비자에게 불리하게 설정되어 있어 검토가 필요합니다. 관련 법규: 소비자기본법 제16조"
  })

  const handleReviewRequest = () => {
    if (!pdfContent) {
      toast({
        title: "검토 요청 실패",
        description: "먼저 PDF 파일을 업로드해주세요.",
        variant: "destructive"
      })
      return
    }

    setIsReviewing(true)
    setTimeout(() => {
      setReviewResult("이용약관 중 <span class='bg-yellow-200'>제7조 2항</span>과 <span class='bg-yellow-200'>제12조 1항</span>은 소비자에게 불리한 독소조항으로 의심됩니다. <span class='bg-yellow-200'>제15조 3항</span>은 법적 검토가 필요합니다. 자세한 내용은 해당 조항을 클릭하여 확인하세요.")
      setIsReviewing(false)
      toast({
        title: "검토 완료",
        description: "약관 검토가 완료되었습니다.",
      })
    }, 3000)
  }

  const resetReviewState = () => {
    setPdfContent(null);
    setIsPdfUploaded(false);
    setReviewResult(null);
    setSelectedReviewId(null);
  };

  const handleSelectReview = (reviewId: number | null) => {
    if (reviewId === null) {
      resetReviewState();
    } else {
      setSelectedReviewId(reviewId);
      // Fetch the review data from the server
      // For now, we'll use dummy data
      setPdfContent("이것은 선택된 리뷰의 원본 약관 내용입니다.");
      setReviewResult("이용약관 중 <span class='bg-yellow-200'>제7조 2항</span>과 <span class='bg-yellow-200'>제12조 1항</span>은 소비자에게 불리한 독소조항으로 의심됩니다. <span class='bg-yellow-200'>제15조 3항</span>은 법적 검토가 필요합니다.");
    }
  };

  useEffect(() => {
    // 웹소켓 연결 생성
    const newSocket = new WebSocket('ws://localhost:8080/ws');
    setSocket(newSocket);

    // open
    newSocket.onopen = function () {
      console.log('웹소켓 연결이 성공적으로 열렸습니다.');

      // 30초마다 ping 메시지 전송
      setInterval(() => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.send(JSON.stringify({ type: 'ping' }));
          console.log('ping');
        }
      }, 30000); // 30초마다 전송
    };

    // 메세지 수신
    newSocket.onmessage = function (event) {
      console.log('메시지를 수신했습니다:', event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'test' && data.content) {
          // const outputElement = document.getElementById('output-test') as HTMLTextAreaElement;
          // outputElement.value += data.content + '\n';

        } else if (data.type === 'total' && data.content) {
          // const outputElement = document.getElementById('output-test') as HTMLTextAreaElement;
          // outputElement.value += data.content + '\n';
          let totalText = "";
          for (let i = 0; i < data.length; i++) {
            console.log(data.content[i])
            totalText += `<div id="content-${i}" class="bg-gray-200 m-1 p-2 rounded">${data.content[i]}</div>`;
          }
          setPdfContent(totalText)

        } else if (data.type === 'review' && data.content) {
          setReviewResult(prevResult => {
            let newResult = prevResult || "";

            // 색깔 지정
            const gradeColorMap: { [key: string]: string } = {
              "A": "green",
              "B": "gray",
              "C": "red"
            };
            const color = gradeColorMap[data.grade] || "gray";

            newResult += `<div id="review-${data.number}" class="bg-${color}-200 m-1 p-2 rounded">${data.content}</div>`;
            return newResult;
          });
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
      }
    };

    // 에러 발생
    newSocket.onerror = function (error) {
      console.error('웹소켓 오류:', error);
    };

    // 닫을때
    newSocket.onclose = function (event) {
      console.log('웹소켓 연결이 종료되었습니다.', event);
      if (event.wasClean) {
        console.log(`연결이 정상적으로 종료되었습니다. 코드: ${event.code}, 이유: ${event.reason}`);
      } else {
        console.error(`연결이 비정상적으로 종료되었습니다. 코드: ${event.code}, 이유: ${event.reason}`);
        console.error('비정상 종료 원인:', event);
      }
    };


    // ============================== 입력 테스트용 함수 ==================================

    const addContent = (input: string, number: number = 1) => {
      setIsPdfUploaded(true);
      setPdfContent(prevResult => {
        let newResult = prevResult || "";

        newResult += `<div id="content-${number}" class="bg-gray-200 m-1 p-2 rounded">${input}</div>`;
        return newResult;
      });
    }

    const addResult = (input: string, grade: string = 'B', number: number = 1) => {
      setIsPdfUploaded(true);
      setReviewResult(prevResult => {
        let newResult = prevResult || "";

        // 색깔 지정
        const gradeColorMap: { [key: string]: string } = {
          "A": "green",
          "B": "gray",
          "C": "red"
        };
        const color = gradeColorMap[grade] || "gray";

        newResult += `<div id="review-${number}" class="bg-${color}-200 m-1 p-2 rounded">${input}</div>`;
        return newResult;
      });


    }

    // 전역 범위에 함수 노출
    (window as any).addContent = addContent;
    (window as any).addResult = addResult;

    return () => {
      newSocket.close();
    };

  }, []);

  const handleSendMessage = () => {
    const inputElement = document.getElementById('input-test') as HTMLInputElement;
    const message = inputElement.value;
    if (socket && socket.readyState === WebSocket.OPEN) {
      const jsonMessage = JSON.stringify({ type: 'test', content: message });
      socket.send(jsonMessage);
      console.log('메시지를 전송했습니다:', jsonMessage);
    } else {
      console.error('웹소켓 연결이 열려 있지 않습니다.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 확장자 및 MIME 타입 검사
      const allowedExtensions = ['.pdf', '.hwp', '.hwpx'];
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (
        file.type === 'application/pdf' ||
        fileExtension === '.hwp' ||
        fileExtension === '.hwpx'
      ) {
        setPdfContent("이것은 업로드된 파일의 내용입니다. 실제 구현에서는 PDF에서 추출한 텍스트가 여기에 표시됩니다.");
        setReviewResult(null);
        setIsPdfUploaded(true);
        toast({
          title: "파일 업로드 성공",
          description: "파일이 성공적으로 업로드되었습니다.",
        });

        // 웹소켓으로 파일 전송
        if (socket && socket.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const fileContent = event.target?.result;
            if (typeof fileContent === 'string') {
              const base64Content = fileContent.split(',')[1]; // Base64 부분만 추출
              const compressedContent = compressData(base64Content); // content 압축

              // 보낼 JSON 생성
              const jsonMessage = JSON.stringify({
                type: 'review',
                content: compressedContent,
                fileName: file.name,
                fileType: file.type
              });

              // JSON 송신
              socket.send(jsonMessage);
              console.log('파일을 전송했습니다:', jsonMessage);
            }
          };
          reader.readAsDataURL(file);
        } else {
          console.error('웹소켓 연결이 열려 있지 않습니다.');
        }
      } else {
        toast({
          title: "파일 형식 오류",
          description: "허용된 파일 형식은 PDF, HWP, HWPX 입니다.",
          variant: "destructive"
        });
      }
    }
    // 파일 입력 필드 리셋
    if (e.target) {
      e.target.value = '';
    }
  };

  function compressData(base64Content: string) {
    const binaryString = atob(base64Content);
    const charData = binaryString.split('').map(char => char.charCodeAt(0));
    const binData = new Uint8Array(charData);
    const compressedData = pako.deflate(binData);
    return btoa(String.fromCharCode.apply(null, compressedData as unknown as number[]));
  }

  return (
    <Layout>
      <div className="hidden">
        <div className="bg-green-200"></div>
        <div className="bg-gray-200"></div>
        <div className="bg-red-200"></div>
      </div>
      <div className="flex h-[calc(100vh-8rem)] p-4">
        {user && (
          <div className="w-64 flex-shrink-0">
            <ReviewSidebar onSelectReview={handleSelectReview} selectedReviewId={selectedReviewId} />
          </div>
        )}
        <div className="flex-grow flex flex-col overflow-hidden">
          <h1 className="text-3xl font-bold text-blue-800 px-8 pt-8">약관 검토 요청</h1>
          <div className="flex-grow flex overflow-hidden">
            <div className="w-1/2 p-10 flex flex-col">
              {selectedReviewId === null ? (
                <>
                  {!isPdfUploaded && (
                    <div className="mb-4">
                      <input
                        type="file"
                        accept=".pdf,.hwp,.hwpx"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <Button onClick={() => fileInputRef.current?.click()}>
                        PDF 업로드
                      </Button>
                    </div>
                  )}
                  {pdfContent && (
                    <div className="flex-grow flex flex-col overflow-hidden">
                      <h2 className="text-xl font-semibold mb-2">업로드된 약관 내용</h2>
                      <ScrollArea className="flex-grow border p-4 rounded">
                        <div dangerouslySetInnerHTML={{ __html: pdfContent }} />
                      </ScrollArea>
                      <Button
                        className="mt-4"
                        onClick={handleReviewRequest}
                        disabled={isReviewing}
                      >
                        {isReviewing ? '검토 중...' : '약관 검토 요청'}
                      </Button>
                      {isPdfUploaded && (
                        <Button
                          className="mt-4"
                          onClick={() => {
                            resetReviewState()
                          }}
                        >
                          초기화
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <OriginalDocument reviewId={selectedReviewId} />
              )}
              {/* <div className="mt-4 flex items-center">
                <input id="input-test" type="text" placeholder="입력 테스트" className="border p-2 rounded w-full" />
                <Button className="ml-2" onClick={handleSendMessage}>보내기</Button>
              </div>
              <textarea id="output-test" placeholder="출력 테스트" className="border p-2 rounded w-full mt-2" rows={4}></textarea> */}
            </div>
            <div className="w-1/2 p-4">
              {reviewResult && (
                <div className="flex-grow flex flex-col overflow-hidden">
                  <h2 className="text-xl font-semibold mb-2">검토 결과</h2>
                  <ScrollArea className="flex-grow border p-4 rounded h-64">
                    <div dangerouslySetInnerHTML={{ __html: reviewResult }} />
                  </ScrollArea>
                </div>
              )}
              {/*<ReviewResult
                result={reviewResult}
                clauseDetails={clauseDetails}
                isExistingReview={selectedReviewId !== null}
              />*/}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

