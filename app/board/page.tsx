'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from '../components/Layout';
import Link from 'next/link';
import BoardBar from "@/app/components/BoardBar";
//db에서 데이터를 연동해야할곳
import BoardPageTemplate from '@/app/components/BoardPageTemplate';

interface Post {
    id: number
    title: string
    author: string
    created_at: string
}

export default function BoardPage() {
    const postsPerPage = 10;
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://${hostname}:8080/board/list?page=${currentPage - 1}`);
                if (!response.ok) {
                    throw new Error("게시글을 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setPosts(data.content); // 백엔드에서 `Page<Question>` 형태라면 `.content` 사용
                setTotalPages(data.totalPages);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        router.push(`/board?page=${page}`);
    };

    return (
        <Layout>
            <Suspense fallback={<div>Loading...</div>}>
                <BoardPageTemplate
                    title="공지사항"
                    breadcrumb={[
                        { label: '홈', href: '/' },
                        { label: '알림마당', href: '/board' },
                        { label: '게시판', href: '/board' },
                    ]}
                    posts={posts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    postsPerPage={postsPerPage}
                    onPageChange={handlePageChange}
                />
            </Suspense>
        </Layout>
    );
}

function BoardPageWrapper() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    return <BoardPage key={currentPage} />;
}

