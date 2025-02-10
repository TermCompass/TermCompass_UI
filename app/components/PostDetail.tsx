'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Comment {
    id: number;
    content: string;
    author: string;
    created_at: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: string;
    answers: Comment[];
}

interface PostDetailProps {
    post: Post;  // Define the type of `post` as necessary
}

export default function PostDetail({ post }: PostDetailProps) {
    const { id } = useParams();
    const postId = id ? parseInt(Array.isArray(id) ? id[0] : id, 10) : NaN;
    const [comments, setComments] = useState<any[]>();
    const [newComment, setNewComment] = useState<string>('');

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const response = await fetch(`/answer/create/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ content: newComment }), // 댓글 내용 전송
                });

                if (!response.ok) {
                    throw new Error('댓글 등록에 실패했습니다.');
                }

                window.location.reload()
            } catch (error) {
                console.error(error);
                alert('댓글 등록 중 오류가 발생했습니다.');
            }
        }
    };

    if (!post) {
        return <p className='text-gray-700'>게시글을 불러오는 중입니다...</p>;
    }

    // @ts-ignore
    return (
        <div className='container mx-auto px-4 py-8 w-full'>
            <div className='flex font-goverment w-[85%] space-x-4 py-2 mx-auto rounded-lg mt-2 text-4xl border-b-2'>
                소통창구
            </div>

            <div className='p-6 bg-white shadow-md rounded-md w-[85%] mx-auto mt-4'>
                <h2 className='text-3xl font-bold mb-4 border-b-2 pb-1'>{post.title}</h2>
                <div className='flex items-center justify-between pb-1 border-b-2'>
                    <span className='text-gray-800 font-semibold'>작성자: {post.author}</span>
                    <span className='text-gray-500 text-sm'>{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <div className='text-gray-800 pt-10 border-b-2 min-h-[300px]'>
                    <p className='text-lg break-words'>{post.content}</p>
                </div>
            </div>

            <div className='w-[85%] mx-auto mt-6'>
                <h3 className='text-xl font-semibold mb-2'>댓글</h3>
                <form onSubmit={handleCommentSubmit} className='flex flex-col gap-2'>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='댓글을 입력하세요...'
                        className='flex-grow w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]'
                    />
                    <button type='submit' className='px-4 py-2 bg-blue-500 text-white my-3 rounded-lg hover:bg-blue-600 self-end'>
                        등록
                    </button>
                </form>
            </div>

            <div className='w-[85%] mx-auto mt-4'>
                {post.answers?.length === 0 ? (
                    <p className='text-gray-500'>등록된 댓글이 없습니다.</p>
                ) : (
                    <ul className='space-y-3'>
                        {post.answers?.map((comment) => (
                            <li key={comment.id} className='p-3 border rounded-md bg-white shadow-md'>
                                <div className='flex justify-between items-center'>
                                    <span className='font-semibold'>{comment.author}</span>
                                    <span className='text-sm text-gray-500'>{new Date(comment.created_at).toLocaleString()}</span>
                                </div>
                                <p className='mt-2 text-gray-700'>{comment.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
