'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from '@/app/components/Layout';
import Link from 'next/link';
import PostDetail from '@/app/components/PostDetail';
import BoardBar from "@/app/components/BoardBar";
import HeaderBanner from "@/app/components/BoardBanner";

export default function BoardPage() {
    const [post, setPost] = useState<any>(null);  // 게시글 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState<string | null>(null);  // 오류 상태

    const router = useRouter();
    const { id: postId } = useParams();

    useEffect(() => {
        if (!postId) return;

        const fetchPostDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/board/detail/${postId}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch post details");
                }
                const data = await response.json();
                setPost(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    //
    // if (error) {
    //     return <div>{error}</div>;
    // }
    //
    // if (!post) {
    //     return <div>No post found</div>;
    // }

    return (
        <Layout>
            {/* 헤더 배경 및 타이틀 */}
            <HeaderBanner
                title="공지사항"
                breadcrumb={[
                    { label: "게시판", href: "/board" },
                    { label: "공지사항", href: "/board" },
                ]}
            />

            {/* 게시글 상세 내용 */}
            <div className="container w-full mx-auto px-4 py-8 flex flex-col md:flex-row">
                {/* 게시글 상세 정보 */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <PostDetail post={post}/>
                </div>

                {/* 우측 메뉴 (반응형 적용) */}
                <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                    <BoardBar />
                </div>
            </div>
        </Layout>
    );
}
