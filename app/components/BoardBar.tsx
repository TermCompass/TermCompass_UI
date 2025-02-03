import { useState, useEffect } from 'react';

export default function ResponsiveMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isActive, setIsActive] = useState(true);

    // 특정 화면 크기에서 메뉴 비활성화
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 1600) {
                setIsActive(false); // screenWidth px 이하에서 비활성화
            } else {
                setIsActive(true); // screenWidth 이상에서 활성화
            }
        };

        handleResize(); // 초기 상태 설정
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!isActive) {
        return null; // 메뉴가 비활성화되면 렌더링하지 않음
    }

    return (
        <div
            className={`fixed top-[23%] right-[17%] w-[80%] md:w-[10%] min-w-[200px] p-4 border-l shadow-md transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } md:translate-x-0`}
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
    );
}
