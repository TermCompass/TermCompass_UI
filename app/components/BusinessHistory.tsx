"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";

interface ReviewHistory {
  id: number;
  recordType: string;
  result: string;
  title: string;
  createdDate: string;
  requests: { request: string; answer: string; id: number }[];
}

interface HistoryItem {
  id: number;
  createdDate: string;
  title: string;
  recordType: string;
  result: string;
}

export default function BusinessHistory() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const [historyItem, setHistoryItem] = useState<ReviewHistory[]>([]);

  const mapRecordTypeToKorean = (recordType: string) => {
    switch (recordType) {
      case "REVIEW":
        return "검토";
      case "GENERATE":
        return "생성";
      case "CHAT":
        return "채팅";
      default:
        return recordType;
    }
  };

  useEffect(() => {
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
    if (!user) return;
    fetch(`/records/${user.id}?recordsOnly=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
          .filter((item: any) => item.recordType !== "CHAT")
          .map((item: any) => ({
            id: item.id,
            recordType: item.recordType,
            result: item.result,
            title: item.title,
            createdDate: item.createdDate.replace("T", " ").substring(0, 16),
            requests: item.requests.map((req: any) => ({
              request: req.request,
              answer: req.answer,
              id: req.id,
            })),
          }));
        setHistoryItem(formattedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [user?.id]);

  const handleReviewRedirect = (id: number) => {
    router.push(`/review-request?id=${id}`);
  };

  // 인쇄 버튼
  const handlePrint = () => {
    const parser = new DOMParser();
    if (!selectedItem?.result) {
      console.error("No result to parse");
      return;
    }
    const doc = parser.parseFromString(selectedItem.result, 'text/html');

    // 모든 button 요소 제거
    doc.querySelectorAll('button').forEach(button => button.remove());

    const editableContent = doc.body.innerHTML;

    // 새 창 열기
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>${selectedItem?.title}</title>
          <style>

            /* 인쇄 스타일 */
            
            * {
              margin: 5px;
              padding: 5px;
            }

            h1 {
              font-size: 2em;
              font-weight: bold;
              margin-top: 0.67em;
              margin-bottom: 0.67em;
            }

            h4 {
              font-size: 1.0em;
              font-weight: bold;
              margin-top: 1.33em;
              margin-bottom: 1.33em;
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }

            th,td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }

            ol {
              list-style: none;
              counter-reset: list-counter;
            }

            ol > li {
              counter-increment: list-counter;
            }

            ol > li:nth-child(1)::before { content: '① '; }
            ol > li:nth-child(2)::before { content: '② '; }
            ol > li:nth-child(3)::before { content: '③ '; }
            ol > li:nth-child(4)::before { content: '④ '; }
            ol > li:nth-child(5)::before { content: '⑤ '; }
            ol > li:nth-child(6)::before { content: '⑥ '; }
            ol > li:nth-child(7)::before { content: '⑦ '; }
            ol > li:nth-child(8)::before { content: '⑧ '; }
            ol > li:nth-child(9)::before { content: '⑨ '; }
            ol > li:nth-child(10)::before { content: '⑩ '; }
            ol > li:nth-child(11)::before { content: '⑪ '; }
            ol > li:nth-child(12)::before { content: '⑫ '; }
            ol > li:nth-child(13)::before { content: '⑬ '; }
            ol > li:nth-child(14)::before { content: '⑭ '; }
            ol > li:nth-child(15)::before { content: '⑮ '; }
      
          </style>
        </head>
        <body>
          ${editableContent}
        </body>
      </html>
    `);
      printWindow.document.close(); // 문서 로드 완료
      printWindow.focus(); // 창에 포커스 맞추기
      printWindow.print(); // 인쇄 실행
      printWindow.close(); // 인쇄 후 창 닫기}
    }
  };

  return (
    <div className="space-y-4">
      <style jsx global>{`
        #editableContent * {
          margin: 5px;
          padding: 5px;
        }

        #editableContent > h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        #editableContent > h4 {
          font-size: 1.0em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }

        #editableContent th,
        #editableContent td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }

        #editableContent > ol {
          list-style: none;
          counter-reset: list-counter;
        }

        #editableContent > ol > li {
          counter-increment: list-counter;
        }

        #editableContent > ol > li:nth-child(1)::before { content: '① '; }
        #editableContent > ol > li:nth-child(2)::before { content: '② '; }
        #editableContent > ol > li:nth-child(3)::before { content: '③ '; }
        #editableContent > ol > li:nth-child(4)::before { content: '④ '; }
        #editableContent > ol > li:nth-child(5)::before { content: '⑤ '; }
        #editableContent > ol > li:nth-child(6)::before { content: '⑥ '; }
        #editableContent > ol > li:nth-child(7)::before { content: '⑦ '; }
        #editableContent > ol > li:nth-child(8)::before { content: '⑧ '; }
        #editableContent > ol > li:nth-child(9)::before { content: '⑨ '; }
        #editableContent > ol > li:nth-child(10)::before { content: '⑩ '; }
        #editableContent > ol > li:nth-child(11)::before { content: '⑪ '; }
        #editableContent > ol > li:nth-child(12)::before { content: '⑫ '; }
        #editableContent > ol > li:nth-child(13)::before { content: '⑬ '; }
        #editableContent > ol > li:nth-child(14)::before { content: '⑭ '; }
        #editableContent > ol > li:nth-child(15)::before { content: '⑮ '; }
      `}</style>
      <h2 className="text-2xl font-bold">이용 내역</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>날짜</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>도메인</TableHead>
            <TableHead>상세</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyItem.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.createdDate}</TableCell>
              <TableCell>{mapRecordTypeToKorean(item.recordType)}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {item.recordType === "REVIEW" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleReviewRedirect(item.id)}
                  >
                    검토 요청 보기
                  </Button>
                ) : item.recordType === "GENERATE" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedItem(item)}>
                        상세 보기
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="p-10 sm:max-w-[1188px] max-h-[80vh]">
                      <div className="p-5 sm:max-w-[1188px] max-h-[75vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>이용 내역 상세</DialogTitle>
                          <DialogDescription>
                            {selectedItem?.title}의 생성 내역입니다.
                          </DialogDescription>
                          <Button className="bg-black text-white hover:bg-blue-600" onClick={handlePrint}>프린트</Button>

                        </DialogHeader>
                        <div id="editableContent" className="mb-4 border p-2" contentEditable="false" dangerouslySetInnerHTML={{ __html: selectedItem?.result || '' }}></div>
                      </div>
                    </DialogContent>

                  </Dialog>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
