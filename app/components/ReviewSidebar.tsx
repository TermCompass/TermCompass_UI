import { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useUser } from '../contexts/UserContext'

// 더미 데이터 - 실제 구현시 서버에서 가져와야 합니다
// const dummyHistory = [
//   { id: 1, date: '2023-06-25', title: '이용약관 검토' },
//   { id: 2, date: '2023-06-24', title: '개인정보 처리방침 검토' },
//   { id: 3, date: '2023-06-23', title: '환불 정책 검토' },
// ]

interface ReviewSidebarProps {
  onSelectReview: (review: ReviewHistory | null) => void;
  selectedReview: ReviewHistory | null;
  resetReviewState: () => void; // resetReviewState prop 추가
}

export interface ReviewHistory {
  id: number;
  recordType: string;
  result: string;
  title: string;
  requests: { request: string, answer: string, id: number }[];
}

export default function ReviewSidebar({ onSelectReview, selectedReview, resetReviewState }: ReviewSidebarProps) {
  const { user } = useUser();
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);

  useEffect(() => {
    // console.log('ReviewSidebar useEffect');
    if (!user) return;
    let reviewHistory
    const fetchReviewHistory = async () => {
      try {
        const response = await fetch(`http://kyj9447.ddns.net:8080/records/${user.id}`);
        if (!response.ok) throw new Error('서버 오류');

        const data = await response.json();
        // console.log("data : "+data);

        // recordType이 'REVIEW'인 데이터만 필터링
        reviewHistory = data.filter((record: ReviewHistory) => record.recordType === "REVIEW");
        console.log(reviewHistory);

        setReviewHistory(reviewHistory);

      } catch (error) {
        console.error('채팅 기록을 불러오는 중 오류 발생:', error);
      }
    };

    fetchReviewHistory();

  }, [user]);
  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <Button className="w-full mb-4" onClick={() => resetReviewState()}>새 검토 요청</Button>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {reviewHistory.map((review) => (
          <div
            key={review.id}
            className={`p-2 mb-2 rounded cursor-pointer ${selectedReview?.id === Number(review.id) ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
            onClick={() => onSelectReview(review)}
          >
            <div className="font-semibold">{review.title}</div>
            {/* <div className="text-sm text-gray-500">{review.date}</div> */}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

