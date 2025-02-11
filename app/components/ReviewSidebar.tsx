import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

interface ReviewSidebarProps {
  onSelectReview: (review: ReviewHistory | null) => void;
  selectedReview: ReviewHistory | null;
  resetReviewState: () => void;
  initialReviewId: string | null;
}

export interface ReviewHistory {
  id: number;
  recordType: string;
  result: string;
  title: string;
  requests: { request: string, answer: string, id: number }[];
}

export default function ReviewSidebar({ onSelectReview, selectedReview, resetReviewState, initialReviewId }: ReviewSidebarProps) {
  const { user } = useUser();
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);

  useEffect(() => {
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;

    if (!user) return;

    const fetchReviewHistory = async () => {
      try {
        const response = await fetch(`/records/${user.id}`);
        if (!response.ok) throw new Error('서버 오류');

        const data = await response.json();

        // recordType이 'REVIEW'인 데이터만 필터링
        const reviewHistory = data.filter((record: ReviewHistory) => record.recordType === "REVIEW");
        setReviewHistory(reviewHistory);

        // initialReviewId가 있는 경우 해당 리뷰 자동 선택
        if (initialReviewId) {
            const initialReview: ReviewHistory | undefined = reviewHistory.find((review: ReviewHistory) => review.id === Number(initialReviewId));
          if (initialReview) {
            onSelectReview(initialReview);
          }
        }
      } catch (error) {
        console.error('채팅 기록을 불러오는 중 오류 발생:', error);
      }
    };

    fetchReviewHistory();
  }, [user, initialReviewId]);

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
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}