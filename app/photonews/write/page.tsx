'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCreatePage from '@/app/components/PostCreatedTemplate'

export default function writePage() {
    const { id } = useParams();
    const postId = id ? parseInt(Array.isArray(id) ? id[0] : id, 10) : NaN;
    const [post, setPost] = useState<any | null>(null);
    const [newComment, setNewComment] = useState<string>('');


    return (
        <PostCreatePage boardTitle="포토뉴스" />
    );
}
