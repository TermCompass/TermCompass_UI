'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from '@/app/components/Layout';
import Link from 'next/link';
import PostDetail from '@/app/components/PostDetail';
import BoardBar from "@/app/components/BoardBar";
//실제 api연동해야할곳
const dummyPosts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `${i + 1} 번째 게시글`,
    author: `작성자 ${i + 1}`,
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    link: `/board/${i + 1}`,
    detail: `내용 ${1+i}`
}));

export default function BoardPage() {
    const postsPerPage = 12;
    const totalPages = Math.ceil(dummyPosts.length / postsPerPage);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page")) || 1
    );

    useEffect(() => {
        const pageFromURL = Number(searchParams.get("page"));
        if (pageFromURL && pageFromURL !== currentPage) {
            setCurrentPage(pageFromURL);
        }
    }, [searchParams, currentPage]);

    const currentPosts = dummyPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`/board?${params.toString()}`);
        setCurrentPage(page);
    };


    return (
        <Layout>
            {/* 헤더 배경 및 타이틀 */}
            <div className="relative w-full h-[200px] overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md"
                    style={{ backgroundImage: "url('/board_img.jpg')" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h1 className="font-custom text-white text-6xl font-bold mb-4">공지사항</h1>
                        <div className="flex items-center space-x-4 px-4 py-2 rounded-lg">
                            <a href="/" className="hover:opacity-80 transition-opacity">
                                <img src="/ic_sub_nav_home.png" alt="Home" className="w-6 h-6" />
                            </a>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 text-lg">&gt;</span>
                                <span className="text-gray-700 text-xl font-semibold">게시판</span>
                                <span className="text-gray-500 text-lg">&gt;</span>
                                <span className="text-gray-900 text-xl font-semibold">공지사항</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 게시글 상세 내용 */}
            <div className="container w-full mx-auto px-4 py-8 flex flex-col md:flex-row">
                {/* 게시글 상세 정보 */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <PostDetail />
                </div>

                {/* 우측 메뉴 (반응형 적용) */}
                <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                    <BoardBar />
                </div>
            </div>
        </Layout>
    );
}
