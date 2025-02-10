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
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface ReviewHistory {
  id: number;
  recordType: string; // RecordType from Java enum
  result: string;
  title: string;
  createdDate: string; // LocalDateTime to string format
  requests: { request: string, answer: string, id: number }[];
}

interface HistoryItem {
  id: number;
  createdDate: string; // LocalDateTime to string format
  title: string;
  recordType: string;
  result: string;
}

export default function BusinessHistory() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { user } = useUser();
  const [historyItem, setHistoryItem] = useState<ReviewHistory[]>([]); // Store fetched history items

  const mapRecordTypeToKorean = (recordType: string) => {
    switch (recordType) {
      case 'REVIEW':
        return '검토';
      case 'GENERATE':
        return '생성';
      case 'CHAT':
        return '채팅';
      default:
        return recordType; // If something unexpected happens, return the original value
    }
  };

  useEffect(() => {
    if (!user) return;
    // Fetch records from the API
    fetch(`http://kyj9447.ddns.net:8080/records/${user.id}?recordsOnly=false`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Format the fetched data
        const formattedData = data.map((item: any) => ({
          id: item.id,
          recordType: item.recordType, // Map Java enum to string
          result: item.result,
          title: item.title,
          createdDate: item.createdDate.replace('T', ' ').substring(0, 16), // Format LocalDateTime
          requests: item.requests.map((req: any) => ({
            request: req.request,
            answer: req.answer,
            id: req.id,
          })),
        }));
        setHistoryItem(formattedData); // Update state with formatted data
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  }, [user?.id]);

  return (
    <div className="space-y-4">
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
              <TableCell>{mapRecordTypeToKorean(item.recordType)}</TableCell> {/* Map the recordType field */}
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedItem(item)}>
                      상세 보기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>이용 내역 상세</DialogTitle>
                      <DialogDescription>
                        {selectedItem?.title}의 {selectedItem?.recordType} 내역입니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>날짜: {selectedItem?.createdDate}</div>
                      <div>유형: {mapRecordTypeToKorean(selectedItem?.recordType || '')}</div>
                      <div>도메인: {selectedItem?.title}</div>
                      <div>상태: {selectedItem?.result}</div>
                      <div>
                        상세 내용: 이 부분은 실제 서비스에서 약관 {selectedItem?.recordType}에 대한 구체적인 내용이 표시될
                        곳입니다. 현재는 더미 데이터를 사용하고 있어 구체적인 내용이 없습니다.
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
