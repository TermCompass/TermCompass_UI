'use client';

import Link from 'next/link';
import BoardBar from '@/app/components/BoardBar';
import HeaderBanner from '@/app/components/BoardBanner';
import { useRouter } from "next/navigation";
interface BoardPageTemplateProps {
    title: string;
    breadcrumb: { label: string; href: string }[];
    posts: { id: number; title: string; author: string; date: string; link: string }[];
    currentPage: number;
    totalPages: number;
    postsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function BoardPageTemplate({
                                              title,
                                              breadcrumb,
                                              posts,
                                              currentPage,
                                              totalPages,
                                              postsPerPage,
                                              onPageChange,
                                          }: BoardPageTemplateProps) {
    const currentPosts = posts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const router = useRouter();
    return (
        <div>
            {/* 배경 이미지 및 제목 */}
            <HeaderBanner
                title="공지사항"
                breadcrumb={[
                    { label: "게시판", href: "/board" },
                    { label: "공지사항", href: "/board" },
                ]}
            />

            {/* 게시판 + 메뉴바 수평 배치 */}
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

                {/* 게시판 (메뉴바보다 넓게 차지) */}
                <div className="flex-grow md:w-3/4">
                    <table className="w-full border-collapse border-t-4 border-b border-gray-300 mx-auto">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-t border-b border-gray-300 font-bold w-1/12">
                                번호
                            </th>
                            <th className="px-4 py-2 border-t border-b border-gray-300 font-bold w-6/12">
                                제목
                            </th>
                            <th className="px-4 py-2 border-t border-b border-gray-300 font-bold w-2/12">
                                작성자
                            </th>
                            <th className="px-4 py-2 border-t border-b border-gray-300 font-bold w-2/12">
                                작성일
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-t border-b border-gray-300 text-center">
                                    {post.id}
                                </td>
                                <td className="px-4 py-2 border-t border-b text-left">
                                    <Link href={post.link} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 border-t border-b text-center">
                                    {post.author}
                                </td>
                                <td className="px-4 py-2 border-t border-b text-center">{post.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 페이지네이션 */}
                    <div className="flex flex-col md:flex-row  justify-between items-center mt-4">
                        {/* 🔹 글쓰기 버튼 */}
                        <button
                            onClick={() => {
                                if (breadcrumb.length > 0) {
                                    const lastBreadcrumb = breadcrumb[breadcrumb.length - 1].href; // ✅ 마지막 페이지 가져오기
                                    router.push(`${lastBreadcrumb}/write`); // ✅ 해당 페이지의 /write로 이동
                                }
                            }}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4 md:mb-0"
                        >
                            글쓰기
                        </button>

                        {/* 🔹 페이지네이션 */}
                        <div className="flex justify-center">
                            <ul className="flex space-x-2 items-center">
                                {/* 이전 페이지 버튼 */}
                                <li>
                                    <button
                                        onClick={() => onPageChange(Math.max(currentPage - 5, 1))}
                                        className={`px-4 py-2 border ${
                                            currentPage <= 5
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-white text-gray-700 hover:bg-blue-100"
                                        }`}
                                        disabled={currentPage <= 5}
                                    >
                                        &lt; 이전
                                    </button>
                                </li>

                                {/* 페이지 번호 */}
                                {Array.from({length: totalPages}, (_, i) => i + 1)
                                    .slice(
                                        Math.floor((currentPage - 1) / 5) * 5,
                                        Math.min(
                                            Math.floor((currentPage - 1) / 5) * 5 + 5,
                                            totalPages
                                        )
                                    )
                                    .map((page) => (
                                        <li key={page}>
                                            <button
                                                onClick={() => onPageChange(page)}
                                                className={`px-4 py-2 border ${
                                                    currentPage === page
                                                        ? "bg-gray-700 text-white"
                                                        : "bg-white text-gray-700"
                                                } hover:bg-blue-100`}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                {/* 다음 페이지 버튼 */}
                                <li>
                                    <button
                                        onClick={() =>
                                            onPageChange(Math.min(currentPage + 5, totalPages))
                                        }
                                        className={`px-4 py-2 border ${
                                            currentPage + 5 > totalPages
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-white text-gray-700 hover:bg-blue-100"
                                        }`}
                                        disabled={currentPage + 5 > totalPages}
                                    >
                                        다음 &gt;
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* 메뉴바 (게시판 옆으로 배치) */}
                <div className="md:w-1/4 hidden md:block">
                    <BoardBar/>
                </div>
            </div>
        </div>
    );
}
