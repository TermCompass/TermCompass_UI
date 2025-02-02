"use client"

import { useUser } from "../contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface UserInfoFormProps {
  onChangePassword: () => void
}

export default function UserInfoForm({ onChangePassword }: UserInfoFormProps) {
  const { user } = useUser()

  if (!user) return null

  return (
      <div className="space-y-4">
        {user.userType === "PERSONAL" ? (
            <>
              <div>
                <Label>이름</Label>
                <p>{user.name}</p>
              </div>
              <div>
                <Label>이메일</Label>
                <p>{user.email}</p>
              </div>
            </>
        ) : (
            <>
              <div>
                <Label>회사명</Label>
                <p>{user.name}</p>
              </div>
              <div>
                <Label>사업자등록번호</Label>
                <p>{user.businessNumber}</p>
              </div>
              <div>
                <Label>이메일</Label>
                <p>{user.email}</p>
              </div>
            </>
        )}
        <div>
          <Label>가입일시</Label>
          <p>{new Date(user.created_at).toLocaleString()}</p>
        </div>
        <Button onClick={onChangePassword}>비밀번호 변경</Button>
      </div>
  )
}

