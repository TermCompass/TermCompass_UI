import Link from "next/link";

interface Breadcrumb {
    label: string;
    href: string;
}

interface HeaderBannerProps {
    title: string; // ✅ 동적으로 변경될 제목
    backgroundImage?: string; // ✅ 배경 이미지 (기본값 설정)
    breadcrumb?: Breadcrumb[]; // ✅ 네비게이션 경로
}

export default function HeaderBanner({
                                         title,
                                         backgroundImage = "/board_img.jpg",
                                         breadcrumb = [],
                                     }: HeaderBannerProps)  {
    return (
        <div className="relative w-full h-[200px] overflow-hidden">
            {/* 🔹 배경 이미지 */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            ></div>

            {/* 🔹 텍스트 및 네비게이션 */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    {/* 🔹 동적으로 변경 가능한 제목 */}
                    <h1 className="font-custom text-white text-6xl font-bold mb-4">{title}</h1>

                    {/* 🔹 네비게이션 경로 */}
                    <div className="flex flex-row items-center space-x-4 px-4 py-2 rounded-lg">
                        {/* 홈 버튼 */}
                        {/* 🔹 breadcrumb가 있을 때만 네비게이션 표시 */}
                        {breadcrumb.length > 0 && (
                            <>
                                {/* 홈 버튼 */}
                                <a href="/" className="hover:opacity-80 transition-opacity">
                                    <img src="/ic_sub_nav_home.png" alt="Home" className="w-6 h-6"/>
                                </a>
                                {/* ">" 기호 */}
                                <span className="text-gray-500 text-lg">&gt;</span>
                            </>
                        )}

                        {/* 네비게이션 경로 동적 생성 */}
                        {breadcrumb.map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {index > 0 && <span className="text-gray-500 text-lg">&gt;</span>}
                                <Link href={crumb.href} className="hover:opacity-80">
                                    <span className="text-gray-700 text-xl font-semibold">{crumb.label}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
