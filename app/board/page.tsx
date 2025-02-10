'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from '../components/Layout';
import Link from 'next/link';
import BoardBar from "@/app/components/BoardBar";
import BoardPageTemplate from '@/app/components/BoardPageTemplate';

interface Post {
    id: number
    title: string
    author: string
    created_at: string
}

export default function BoardPage() {
    const postsPerPage = 10;
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPage = Number(searchParams.get('page')) || 1
    const [posts, setPosts] = useState<Post[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/board/list?page=${currentPage - 1}`);
                if (!response.ok) {
                    throw new Error("게시글을 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setPosts(data.content); //
                setTotalPages(data.totalPages);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [currentPage])

    const handlePageChange = (page: number) => {
        router.push(`/board?page=${page}`);
    }

    return (
        <Layout>
        <BoardPageTemplate
            title="게시판"
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            postsPerPage={postsPerPage}
            onPageChange={handlePageChange}
        />
        </Layout>
    );
}

