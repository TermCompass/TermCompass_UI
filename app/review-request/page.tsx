'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Layout from '../components/Layout'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReviewSidebar, { ReviewHistory } from '../components/ReviewSidebar'
import { useUser } from '../contexts/UserContext'
import pako from 'pako'
import { useSearchParams } from "next/navigation";

function ReviewRequest() {
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const [isPdfUploaded, setIsPdfUploaded] = useState(false)
  const [reviewResult, setReviewResult] = useState<string | null>(null)
  const [selectedReviewId, setSelectedReviewId] = useState<ReviewHistory | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resetButton, setResetButton] = useState(true); // 초기화 버튼 참조
  const { toast } = useToast()
  const { user } = useUser()
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [total, setTotal] = useState(100); // Total value for progress calculation
  const [current, setCurrent] = useState(0); // Current progress value
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const resetReviewState = () => {
    setPdfContent(null);
    setIsPdfUploaded(false);
    setReviewResult(null);
    setSelectedReviewId(null);
    setResetButton(true);
  };

  const handleSelectReview = (review: ReviewHistory | null) => {
    setSelectedReviewId(review);
    if (review) {
      let requestsList = review.requests;
      let request = requestsList[0].request
      let answer = requestsList[0].answer

      let requestList = JSON.parse(request)
      let answerList = JSON.parse(answer)

      // PdfContent 설정=================================
      let totalText = "";
      for (let i = 0; i < requestList.length; i++) {
        totalText += `<div class="flex items-center">
                          <div class="bg-gray-100 m-1 p-2 rounded">${i + 1}</div>
                          <div id="content-${i}" class="bg-gray-200 m-1 p-2 rounded">${requestList[i]}</div>
                        </div>`;
      }
      setPdfContent(totalText)

      // 진행바 총 길이 설정
      setTotal(requestList.length);

      // ReviewResult 설정==============================
      let newResult = "";
      for (let i = 0; i < answerList.length; i++) {
        const thisAnswer = JSON.parse(answerList[i])
        console.log(thisAnswer)
        // 색깔 지정
        const gradeColorMap: { [key: string]: string } = {
          "A": "bg-green-200",
          "B": "bg-gray-200",
          "C": "bg-red-200"
        };
        const colorClass = gradeColorMap[thisAnswer.grade] || "bg-gray-200";

        newResult += `<div class="flex items-center">
                        <div class="bg-gray-100 m-1 p-2 rounded">${thisAnswer.number}</div>
                        <div id="review-${thisAnswer.number}" class="${colorClass} m-1 p-2 rounded">${thisAnswer.answer}</div>
                      </div>`;
      }
      setReviewResult(newResult);

      // 진행바 100% 설정
      setCurrent(requestList.length);

      // 초기화버튼 숨김
      setResetButton(false);

      // pdf버튼 숨김
      setIsPdfUploaded(true);

    }
  };

  useEffect(() => {
    // 웹소켓 연결 생성
    const newSocket = new WebSocket('${window.location.protocol}//${window.location.host}/ws');
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

        // test
        if (data.type === 'test' && data.content) {
          // const outputElement = document.getElementById('output-test') as HTMLTextAreaElement;
          // outputElement.value += data.content + '\n';

        }
        // total split된 약관 조항 list
        else if (data.type === 'total' && data.content) {
          // const outputElement = document.getElementById('output-test') as HTMLTextAreaElement;
          // outputElement.value += data.content + '\n';
          let totalText = "";
          for (let i = 0; i < data.content.length; i++) {
            console.log(data.content[i])
            totalText += `<div class="flex items-center">
                            <div class="bg-gray-100 m-1 p-2 rounded">${i + 1}</div>
                            <div id="content-${i}" class="bg-gray-200 m-1 p-2 rounded">${data.content[i]}</div>
                          </div>`;
          }

          // 진행바 총 길이 설정
          setTotal(data.length);
          // PDF 입력부 설정
          setPdfContent(totalText)

        }
        // review 검토된 약관 조항 1개
        else if (data.type === 'review' && data.content) {
          setReviewResult(prevResult => {
            let newResult = prevResult || "";

            // 색깔 지정
            const gradeColorMap: { [key: string]: string } = {
              "A": "bg-green-200",
              "B": "bg-gray-200",
              "C": "bg-red-200"
            };
            const colorClass = gradeColorMap[data.grade] || "bg-gray-200";

            newResult += `<div class="flex items-center">
                            <div class="bg-gray-100 m-1 p-2 rounded">${data.number}</div>
                            <div id="review-${data.number}" class="${colorClass} m-1 p-2 rounded">${data.content}</div>
                          </div>`;
            return newResult;
          });
          setCurrent(data.number);
        }
        // resume 웹소켓 연결 수립시 이미 진행중인 검토가 있는경우
        else if (data.type === 'resume' && data.request) {

          // 파일 업로드부분 비활성화
          setIsPdfUploaded(true);

          // request 채우기
          let totalText = "";
          for (let i = 0; i < data.request.length; i++) {
            console.log(data.request[i])
            totalText += `<div class="flex items-center">
                            <div class="bg-gray-100 m-1 p-2 rounded">${i + 1}</div>
                            <div id="content-${i}" class="bg-gray-200 m-1 p-2 rounded">${data.request[i]}</div>
                          </div>`;
          }
          setTotal(data.request.length)
          setPdfContent(totalText)

          // result 채우기
          let resultText = "";
          for (let i = 0; i < data.answer.length; i++) {
            console.log(data.answer[i])
            let message = JSON.parse(data.answer[i]);
            // 색깔 지정
            const gradeColorMap: { [key: string]: string } = {
              "A": "bg-green-200",
              "B": "bg-gray-200",
              "C": "bg-red-200"
            };
            const colorClass = gradeColorMap[message.grade] || "bg-gray-200";

            resultText += `<div class="flex items-center">
                            <div class="bg-gray-100 m-1 p-2 rounded">${message.number}</div>
                            <div id="review-${message.number}" class="${colorClass} m-1 p-2 rounded">${message.answer}</div>
                          </div>`;
          }
          setReviewResult(resultText)

        }
        // 검토 완료 메세지 받은경우 (end)
        else if (data.type === 'end') {
          // 검토 완료 메세지 받은경우 (end)
          setResetButton(false);
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
          "A": "bg-green-200",
          "B": "bg-gray-200",
          "C": "bg-red-200"
        };
        const colorClass = gradeColorMap[grade] || "bg-gray-200";

        newResult += `<div id="review-${number}" class="${colorClass} m-1 p-2 rounded">${input}</div>`;
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
              console.log("fileName : " + file.name);
              console.log("fileType : " + file.type);

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

  function compressData(base64Content: string): string {
    const binaryString = atob(base64Content);
    const charData = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      charData[i] = binaryString.charCodeAt(i);
    }

    const compressedData = pako.deflate(charData, { raw: false });

    // TextDecoder 사용
    const binaryStringCompressed = new Uint8Array(compressedData);
    const base64Result = btoa(
        Array.from(binaryStringCompressed).map(byte => String.fromCharCode(byte)).join('')
    );

    return base64Result;
  }

  function handleResetClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (window.confirm('정말로 초기화하시겠습니까?\n 현재 진행중인 검토는 저장되지 않습니다.')) {
      resetReviewState();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        const jsonMessage = JSON.stringify({ type: 'stop' });
        socket.send(jsonMessage);
        console.log('작업 중지명령 발신.');
      } else {
        console.error('작업 중지명령 발신에 실패했습니다.');
      }
    }
  }

  // 진행바 표시용 변수
  const progressPercentage = (current / total) * 100;

  return (
      <Layout>
        <div className="flex h-[calc(100vh-8rem)] p-4">
          {user && (
              <div className="w-64 flex-shrink-0">
                <ReviewSidebar onSelectReview={handleSelectReview} selectedReview={selectedReviewId} resetReviewState={resetReviewState} initialReviewId={id} />
              </div>
          )}
          <div className="flex-grow flex flex-col overflow-hidden">
            <h1 className="text-3xl font-bold text-blue-800 px-8 pt-8">약관 검토 요청</h1>
            {!isPdfUploaded ? (
                <div className="px-8 pt-4 pb-2">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-blue-800 mb-1">약관 검토 시작하기</h2>
                        <p className="text-gray-600">
                          PDF 또는 HWP 형식의 약관 파일을 업로드하시면, AI가 약관을 분석하여 상세한 검토 결과를 제공해 드립니다.
                          <span className="block mt-2 text-sm">
                        • 지원 파일 형식: PDF, HWP, HWPX
                      </span>
                        </p>
                        <div className="mb-4 mt-8">
                          <input
                              type="file"
                              accept=".pdf,.hwp,.hwpx"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              style={{ display: 'none' }}
                          />
                          <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition">
                            파일 업로드
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div>
                  <div className="flex-grow flex overflow-hidden">
                    <div id="실선" style={{ width: '50%', padding: '2.5rem', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                      <>
                        {pdfContent && (
                            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <div className="flex justify-between items-center mb-2">
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>업로드된 약관 내용</h2>
                                {resetButton && (<Button
                                    id='reset_button'
                                    onClick={handleResetClick}
                                    className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out shadow-sm active:scale-95"
                                >
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="rotate-[-45deg]"
                                  >
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                    <path d="M16 21h5v-5" />
                                  </svg>
                                  초기화
                                </Button>)}
                              </div>
                              <ScrollArea className="flex-grow border border-slate-200 p-4 rounded-md" style={{ height: 'calc(80vh - 10rem)' }}>
                                <div dangerouslySetInnerHTML={{ __html: pdfContent }} />
                              </ScrollArea>
                            </div>
                        )}
                      </>

                    </div>
                    {/* <div className="mt-4 flex items-center">
                <input id="input-test" type="text" placeholder="입력 테스트" className="border p-2 rounded w-full" />
                <Button className="ml-2" onClick={handleSendMessage}>보내기</Button>
              </div>
              <textarea id="output-test" placeholder="출력 테스트" className="border p-2 rounded w-full mt-2" rows={4}></textarea> */}
                    <div style={{ width: '50%', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                      {reviewResult && isPdfUploaded && (
                          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>검토 결과</h2>
                            <ScrollArea
                                className="flex-grow border border-slate-200 p-4 rounded-md"
                                style={{ height: 'calc(80vh - 10rem)' }}
                            >
                              <div
                                  dangerouslySetInnerHTML={{ __html: reviewResult }}
                                  className="[&_.bg-green-200]:bg-green-200 [&_.bg-gray-200]:bg-gray-200 [&_.bg-red-200]:bg-red-200"
                              />
                            </ScrollArea>
                            {/* <progress value={progressPercentage} max="100" style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }} /> */}
                            <div style={{ position: 'relative', width: '100%', marginTop: '1rem' }}>
                              <progress
                                  value={progressPercentage}
                                  max="100"
                                  style={{
                                    width: '100%',
                                    height: '24px',
                                    borderRadius: '12px',
                                    backgroundColor: '#e0e0e0',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                  }}
                              />
                              <style jsx>{`
                  progress::-webkit-progress-bar {
                    background-color: #e0e0e0;
                    border-radius: 12px;
                  }
                  progress::-webkit-progress-value {
                    background-color: ${progressPercentage === 100 ? '#4caf50' : '#1E40AF'};
                    border-radius: 12px;
                  }
                  progress::-moz-progress-bar {
                    background-color: ${progressPercentage === 100 ? '#4caf50' : '#1E40AF'};
                    border-radius: 12px;
                  }
                `}</style>
                              {progressPercentage === 100 && (
                                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
                                    ✔
                                  </div>
                              )}
                            </div>
                          </div>
                      )}
                      {/*<ReviewResult
                result={reviewResult}
                clauseDetails={clauseDetails}
                isExistingReview={selectedReviewId !== null}
              />*/}
                    </div>
                  </div>
                </div>)}
          </div>
        </div>
      </Layout>
  );

}

// Wrap the component with Suspense
export default function ReviewRequestPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewRequest />
      </Suspense>
  );
}
