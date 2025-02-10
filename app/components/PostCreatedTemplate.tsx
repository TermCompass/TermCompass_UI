
import Layout from '../components/Layout'
import BoardBar from '../components/BoardBar'
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderBanner from "@/app/components/BoardBanner";

interface PostCreateProps {
    boardTitle?: string; // ✅ 게시판 이름을 동적으로 설정
}

export default function PostCreatePage({ boardTitle = "공지사항" }: PostCreateProps) {
    const router = useRouter()
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(boardTitle);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ 현재 게시판에 해당하는 API 주소 가져오기
    const apiUrl = "/board/create";

    // ✅ 게시물 등록 함수
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // ✅ FormData 생성 (파일 업로드 포함)
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            // formData.append("category", category);
            if (file) {
                formData.append("file", file);
            }

            // ✅ API 요청 (게시판별 URL로 전송)
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("서버 오류가 발생했습니다.");
            }

            alert("게시물이 성공적으로 등록되었습니다!");

            // ✅ 입력 필드 초기화
            setTitle("");
            setContent("");
            setFile(null);

            // ✅ /board 페이지로 이동
            router.push("/board");

        } catch (error) {
            alert("게시물 등록 중 오류가 발생했습니다.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {/* ✅ 헤더 배경 및 타이틀 */}
            <HeaderBanner
                title="공지사항"
                breadcrumb={[
                    { label: "게시판", href: "/board" },
                    { label: "공지사항", href: "/board" },
                ]}
            />

            {/* ✅ 게시물 작성 폼 */}
            <div className="container w-full mx-auto px-4 py-8 flex flex-col md:flex-row">
                <div className="w-full md:w-3/4 lg:w-4/5 bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">{boardTitle} 작성</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 🔹 제목 입력 */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* 🔹 내용 입력 */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 입력하세요..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                            />
                        </div>

                        {/* 🔹 파일 업로드 */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                파일 업로드 (선택 사항)
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                            />
                            {file && <p className="text-gray-500 text-sm mt-2">첨부 파일: {file.name}</p>}
                        </div>

                        {/* 🔹 등록 버튼 */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={`px-6 py-3 text-white rounded-lg ${
                                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "등록 중..." : "등록"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
