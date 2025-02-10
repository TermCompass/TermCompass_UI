"use client"

import { useState } from "react"
import { useUser } from "../contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ChangePasswordFormProps {
    onCancel: () => void
}

export default function ChangePasswordForm({ onCancel }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { updateUser } = useUser()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.")
            return
        }
        try {
            const response = await fetch('http://kyj9447.ddns.net:8080/change-password', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                }),
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.json(); // 서버에서 반환된 에러 메시지를 읽음
                console.log(errorData)
            }

            alert("비밀번호가 변경되었습니다.")
            onCancel()
        } catch (error: any) {
            alert("기존 비밀번호가 일치하지 않습니다.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    취소
                </Button>
                <Button type="submit">비밀번호 변경</Button>
            </div>
        </form>
    )
}

