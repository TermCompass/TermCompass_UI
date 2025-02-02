import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

type BusinessHistoryProps = {}

const dummyHistory = [
  { id: 1, date: "2023-06-25", type: "생성", domain: "전자상거래", status: "완료" },
  { id: 2, date: "2023-06-20", type: "수정", domain: "소프트웨어 서비스", status: "검토 중" },
  { id: 3, date: "2023-06-15", type: "생성", domain: "온라인 교육", status: "완료" },
  { id: 4, date: "2023-06-10", type: "수정", domain: "전자상거래", status: "완료" },
  { id: 5, date: "2023-06-05", type: "생성", domain: "여행 서비스", status: "완료" },
]

export default function BusinessHistory({}: BusinessHistoryProps) {
  const [selectedItem, setSelectedItem] = useState<(typeof dummyHistory)[0] | null>(null)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">이용 내역</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>날짜</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>도메인</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>상세</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.domain}</TableCell>
              <TableCell>{item.status}</TableCell>
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
                        {selectedItem?.domain}의 약관 {selectedItem?.type} 내역입니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>날짜: {selectedItem?.date}</div>
                      <div>유형: {selectedItem?.type}</div>
                      <div>도메인: {selectedItem?.domain}</div>
                      <div>상태: {selectedItem?.status}</div>
                      <div>
                        상세 내용: 이 부분은 실제 서비스에서 약관 {selectedItem?.type}에 대한 구체적인 내용이 표시될
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
  )
}

