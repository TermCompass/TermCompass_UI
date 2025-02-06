'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from '@/app/components/Layout';
import Link from 'next/link';
import PostDetail from '@/app/components/PostDetail';
import BoardBar from "@/app/components/BoardBar";
import HeaderBanner from "@/app/components/BoardBanner";
//실제 api연동해야할곳
const dummyPosts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `${i + 1} 번째 게시글`,
    author: `작성자 ${i + 1}`,
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    link: `/photonews/${i + 1}`,
    detail: `내용 ${1+i}`
}));

export default function PhotonewsPage() {
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
        router.push(`/photonews?${params.toString()}`);
        setCurrentPage(page);
    };


    return (
        <Layout>
            {/* 헤더 배경 및 타이틀 */}
            <HeaderBanner
                title="공지사항"
                breadcrumb={[
                    { label: "게시판", href: "/board" },
                    { label: "포토뉴스", href: "/photonews" },
                ]}
            />

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
