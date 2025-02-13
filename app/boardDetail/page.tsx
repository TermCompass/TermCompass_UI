'use client';

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Layout from '@/app/components/Layout';
import Link from 'next/link';
import PostDetail from '@/app/components/PostDetail';
import BoardBar from "@/app/components/BoardBar";
import HeaderBanner from "@/app/components/BoardBanner";

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: string;
    answers: Comment[];
}

export interface Comment {
    id: number;
    content: string;
    author: string;
    created_at: string;
}

function BoardDetail() {
    const [post, setPost] = useState<Post>();  // 게시글 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState<string | null>(null);  // 오류 상태
    const searchParams = useSearchParams();
    const postId = searchParams.get("id");

    useEffect(() => {        
        const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
        if (!postId) return;

        const fetchPostDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://${hostname}/board/detail/${postId}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch post details");
                }
                const data = await response.json();
                console.log("fetched Post: ",data)
                setPost(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    return (
        <Layout>
            {/* 헤더 배경 및 타이틀 */}
            <HeaderBanner
                title="게시판"
            />

            {/* 게시글 상세 내용 */}
            <div className="container w-full mx-auto px-4 py-8 flex flex-col md:flex-row justify-center items-center">
                {/* 게시글 상세 정보 */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    {post && <PostDetail post={post} />}
                </div>
            </div>
        </Layout>
    );
}

// Wrap the component with Suspense
export default function BoardDetailPage() {
    return (
        <Suspense fallback={<div></div>}>
            <BoardDetail />
        </Suspense>
    );
}
