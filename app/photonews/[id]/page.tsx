// app/photonews/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';

// 메타데이터 생성 함수 (SEO에 사용)
export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
    return {
        title: `Photo News ${params.id}`,
        description: `Details for photo news with ID: ${params.id}`,
    };
};

// 페이지 컴포넌트
const PhotoNewsPage = ({ params }: { params: { id: string } }) => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                Photo News ID: {params.id}
            </h1>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>
                This is the detailed page for the photo news with ID: {params.id}.
            </p>
            <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
                Add more details about the news content here...
            </p>
        </div>
    );
};

export default PhotoNewsPage;
