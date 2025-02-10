import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'

interface ReviewHistory {
  id: number;
  recordType: string;
  result: string;
  title: string;
  createdDate: string; // LocalDateTime을 string으로 변환하여 사용
  requests: { request: string, answer: string, id: number }[];
}

interface HistoryItem {
  id: number;
  createdDate: string; // LocalDateTime을 string으로 변환하여 사용
  title: string;
}

export default function ReviewHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;

    if (!user) return;
    // GET 요청 보내기
    fetch(`http://${hostname}:8080/records/${user.id}?recordsOnly=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const formattedData = data.map((item: HistoryItem) => ({
          ...item,
          createdDate: item.createdDate.replace('T', ' ').substring(0, 16),
        }));
        setHistory(formattedData);
      })
      .catch(error => {
        console.error('데이터 가져오기 실패:', error);
      });
  }, [user?.id]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">이전 검토 요청 내역</h2>
      <ScrollArea className="h-[200px] border p-4 rounded">
        {history.map((item) => (
          <div key={item.id} className="mb-2 p-2 bg-gray-100 rounded">
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-gray-500">{item.createdDate}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

