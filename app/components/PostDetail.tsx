'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const dummyPosts = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    title: `${i + 1} 번째 게시글`,
    author: `작성자 ${i + 1}`,
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    detail: `이것은 ${i + 1} 번째 게시글의 상세 내용입니다.`,
}));

const dummyComments = [
    { id: 1, author: '사용자1', content: '21312312! 😊', date: '2025-03-01 14:30:45' },
    { id: 2, author: '사용자2', content: '12321321! 👍', date: '2025-03-01 13:15:22' },
    { id: 3, author: '사용자3', content: '123123. 🙌', date: '2025-02-28 19:42:10' },
    { id: 4, author: '사용자4', content: '1111', date: '2025-02-28 10:20:58' },
    { id: 5, author: '사용자5', content: '123123123!', date: '2025-02-27 22:55:33' },
];

export default function PostDetail() {
    const { id } = useParams();
    const postId = id ? parseInt(Array.isArray(id) ? id[0] : id, 10) : NaN;
    const [post, setPost] = useState<any | null>(null);
    const [comments, setComments] = useState<any[]>(dummyComments);
    const [newComment, setNewComment] = useState<string>('');

    useEffect(() => {
        if (!isNaN(postId)) {
            const selectedPost = dummyPosts.find((p) => p.id === postId);
            setPost(selectedPost || null);
        }
    }, [postId]);

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...dummyComments, { id: comments.length + 1, author: '익명', content: newComment, date: new Date().toISOString() }]);
            setNewComment('');
        }
    };

    if (!post) {
        return <p className='text-gray-700'>게시글을 불러오는 중입니다...</p>;
    }

    const previousPost = dummyPosts.find((p) => p.id === postId - 1);
    const nextPost = dummyPosts.find((p) => p.id === postId + 1);

    return (
        <div className='container mx-auto px-4 py-8 w-full'>
            <div className='flex font-goverment w-[85%] space-x-4 py-2 mx-auto rounded-lg mt-2 text-4xl border-b-2'>
                소통창구
            </div>

            <div className='p-6 bg-white shadow-md rounded-md w-[85%] mx-auto mt-4'>
                <h2 className='text-3xl font-bold mb-4 border-b-2 pb-1'>{post.title}</h2>
                <div className='flex items-center justify-between pb-1 border-b-2'>
                    <span className='text-gray-800 font-semibold'>작성자: {post.author}</span>
                    <span className='text-gray-500 text-sm'>{post.date}</span>
                </div>
                <div className='text-gray-800 pt-10 border-b-2 min-h-[300px]'>
                    <p className='text-lg break-words'>{post.detail}</p>
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
                {comments.length === 0 ? (
                    <p className='text-gray-500'>등록된 댓글이 없습니다.</p>
                ) : (
                    <ul className='space-y-3'>
                        {comments.map((comment) => (
                            <li key={comment.id} className='p-3 border rounded-md bg-white shadow-md'>
                                <div className='flex justify-between items-center'>
                                    <span className='font-semibold'>{comment.author}</span>
                                    <span className='text-sm text-gray-500'>{comment.date}</span>
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
