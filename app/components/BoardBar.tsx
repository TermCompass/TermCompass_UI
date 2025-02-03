import { useState, useEffect } from 'react';

export default function ResponsiveMenu() {

    // 화면 크기 변경 감지하여 메뉴 위치 조정
    return (
        <div>
            {/* 메뉴바 (창 크기에 따라 위치 자동 조정) */}
            <div
                className={`fixed top-[23%] p-4 border-l shadow-md transition-transform duration-300 ease-in-out"
                }`}
                style={{width: "200px" }} // 오른쪽 끝과의 거리 적용
            >
                <h2 className="text-xl font-bold mb-4">공지사항</h2>
                <ul className="space-y-2">
                    <li className="border-b border-gray-300 pb-2 hover:bg-gray-100 cursor-pointer">
                        <a href="/board">공지사항</a>
                    </li>
                    <li className="border-b border-gray-300 pb-2 hover:bg-gray-100 cursor-pointer">
                        <a href="/photonews">포토뉴스</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
