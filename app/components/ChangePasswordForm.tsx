"use client"

import { useState } from "react"
import { useUser } from "../contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ChangePasswordFormProps {
    onCancel: () => void
}

export default function ChangePasswordForm({ onCancel }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { updateUser } = useUser()
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast({
                title: "비밀번호 불일치",
                description: "새 비밀번호가 일치하지 않습니다.",
                variant: "destructive",
            })
            return
        }
        // Here you would typically send a request to your backend to change the password
        // For this example, we'll just show a success message
        toast({
            title: "비밀번호 변경 완료",
            description: "비밀번호가 성공적으로 변경되었습니다.",
        })
        onCancel()
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

