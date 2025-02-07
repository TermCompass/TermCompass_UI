'use client'

import { useState, useEffect ,useRef} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import AuthForm from './AuthForm'
import { useUser } from '../contexts/UserContext'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import {Menu, User} from 'lucide-react'
import MobileNav from './MobileNav'
import FooterSection from './FooterSection'
import FixedFooter from './FixedFooter'
import MiniChatbot from './MiniChatbot'

interface LayoutProps {
  children: React.ReactNode;
  activeSection?: number;
}

export default function Layout({ children, activeSection = 0 }: LayoutProps) {
    const [showAuthForm, setShowAuthForm] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const { user, login, logout } = useUser()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [showFooter, setShowFooter] = useState(false)
    const pathname = usePathname() || '/'
    const router = useRouter()
    const { toast } = useToast()
    const [isTransparent, setIsTransparent] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [isBoardOpen, setIsBoardOpen] = useState(false);
    const boardRef = useRef<HTMLLIElement | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ left: 0 });
    // 로그인한 사용자만 접근 가능한 페이지 목록
    const authenticatedPaths = [
        '/create-terms',
        // '/modify-terms',
        '/business-history',
        '/review-history',
        '/review-request',
        '/ai-chatbot',
        '/my-page'
    ]

    const isAuthenticatedPage = authenticatedPaths.some(path => pathname.startsWith(path))

    const handleHomeClick = (e: React.MouseEvent) => {
        if (pathname === '/') {
            e.preventDefault()
            window.location.href = '/' // 완전한 페이지 새로고침으로 변경
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        // 페이지 로드/새로고침 시 항상 첫 섹션으로 이동
        if (pathname === '/') {
            window.location.hash = 'hero';
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1068)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        // const businessOnlyPaths = ['/create-terms', '/modify-terms', '/business-history']
        const businessOnlyPaths = ['/create-terms', '/business-history']
        if (!isLoggingOut && businessOnlyPaths.includes(pathname) && (!user || user.userType !== 'COMPANY')) {
            toast({
                title: "접근 제한",
                description: "이 기능은 기업 사용자 전용입니다.",
                variant: "destructive",
            })
            router.push('/')
        }
    }, [pathname, user, router, isLoggingOut])

    useEffect(() => {
        if (pathname === '/') {
            const handleHashChange = () => {
                const currentHash = window.location.hash || '#hero';
                setIsTransparent(currentHash === '#hero' && !isHovered);
            };

            // 초기 해시 체크
            handleHashChange();

            // 해시 변경 감지
            window.addEventListener('hashchange', handleHashChange);
            return () => window.removeEventListener('hashchange', handleHashChange);
        } else {
            setIsTransparent(false);
        }
    }, [pathname, isHovered]);


    const navItems = [
        { href: '/site-analysis', label: '사이트 등급' },
        { href: '/review-request', label: '약관 검토' },
        ...(user
            ? user.userType === 'COMPANY'
                ? [
                    { href: '/create-terms', label: '약관 생성' },
                    // { href: '/modify-terms', label: '약관 수정' },  // 임시로 비활성화
                    // { href: '/business-history', label: '생성 내역' }, // 고려해 볼 사항
                ]
                : [
                ]
            : []
        ),
        { href: '/board', label: '게시판' },
        ...(user ? [{ href: "/my-page", label: "마이페이지", icon: User }] : []),
    ]
    const activeNavItems = navItems.filter(item => item.href);
    // 네비바 탭 위치얻어서 밑에 확장창 얻는용도
    useEffect(() => {
        if (boardRef.current) {
            const { left, width } = boardRef.current.getBoundingClientRect();
            setDropdownPos({ left: left + width / 2 }); // 중앙 정렬
        }
    }, [isBoardOpen]); // 드롭다운이 열릴 때마다 위치 갱신
    const handleAuthSubmit = (
        name: string,
        email: string,
        password: string,
        userType: 'PERSONAL' | 'COMPANY',
        created_at: string,
        businessNumber: string,
        isLogin: boolean
    ) => {
        login( email, userType )
        setShowAuthForm(false)
    }

    const handleLogout = () => {
        setIsLoggingOut(true)
        logout()
        router.push('/')
    }

    const handleSectionClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
        window.location.hash = sectionId;
    };

    return (
        <div className={`min-h-screen w-full flex flex-col bg-gray-50 ${pathname === '/' ? 'overflow-hidden' : ''}`}>
            <header
                className={`fixed w-full top-0 z-50 h-20 transition-all duration-300 ${
                    pathname === '/' && isTransparent
                        ? 'bg-transparent border-b border-white/20' 
                        : 'bg-white shadow-md'
                }`}
                onMouseEnter={() => pathname === '/' && setIsHovered(true)}
                onMouseLeave={() => pathname === '/' && setIsHovered(false)}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="cursor-pointer" onClick={handleHomeClick}>
                        <Image
                            src="/logo.png"
                            alt="KOTS Logo"
                            width={50}
                            height={35}
                        />
                        <span className={`text-center block mt-0 text-sm font-bold ${
                            pathname === '/' && isTransparent
                                ? 'text-white'
                                : 'text-gray-900'
                        }`}>KOTS</span>
                    </div>
                    {isMobile ? (
                        <MobileNav
                            navItems={navItems}
                            user={user}
                            onLogout={handleLogout}
                            onLogin={() => setShowAuthForm(true)}
                            buttonColor={pathname === '/' && isTransparent ? 'text-white' : 'text-black'}
                        />
                    ) : (
                        <>
                            <nav>
                                <ul className="relative flex space-x-6 ">
                                    {navItems.map((item) => (
                                        <li key={item.href} ref={item.label === "게시판" ? boardRef : null}>
                                            <Link
                                                href={item.href}
                                                className={`relative transition-colors duration-300 ${
                                                    pathname === '/' && isTransparent
                                                        ? 'text-white font-bold'
                                                        : 'text-gray-900 font-bold'
                                                } group`}
                                                onMouseEnter={() => item.label === '게시판' && setIsBoardOpen(true)}>
                                                <span className="relative w-auto inline-block px-4 sm:px-3 md:px-0 lg:px-6   ">
                                                    {item.label}

                                                <span
                                                    className={`absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                                                        pathname === item.href ? 'w-full' : ''
                                                    }`}>
                                                </span>
                                            </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            {user ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className={`font-bold px-6 py-2.5 rounded-full transition-all duration-300 ${
                                        pathname === '/' && isTransparent
                                            ? 'bg-white/10 border-2 border-white text-white hover:bg-white/20 hover:scale-105 active:bg-white/30'
                                            : 'bg-red-50 border-2 border-red-400 text-red-500 hover:bg-red-100 hover:scale-105 hover:shadow-md active:bg-red-200'
                                    }`}
                                >
                                    로그아웃
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setShowAuthForm(true)}
                                    variant="outline"
                                    className={`font-bold px-6 py-2.5 rounded-full transition-all duration-300 ${
                                        pathname === '/' && isTransparent
                                            ? 'bg-transparent border-2 border-white text-white hover:bg-white/20 hover:scale-105 active:bg-white/30'
                                            : 'bg-blue-50 border-2 border-blue-500 text-blue-600 hover:bg-blue-100 hover:scale-105 hover:shadow-md active:bg-blue-200'
                                    }`}
                                >
                                    로그인 / 회원가입
                                </Button>
                            )}
                        </>
                    )}
                </div>
                {/* 확장바 */}

                {isBoardOpen && (
                    <div
                        className="absolute bg-white shadow-lg border-t border-gray-200 w-full h-[150px] z-40"
                        onMouseEnter={() => setIsBoardOpen(true)}  // ✅ 내부에서 마우스를 올리면 유지
                        onMouseLeave={() => setIsBoardOpen(false)} // ✅ 외부에서 벗어나면 닫힘
                    >
                        <div className="container mx-auto px-4 py-4">
                            {/* ✅ 내부 요소 정렬 (탭 위치 기반) */}
                            <ul
                                className="flex flex-col items-start space-y-2"
                                style={{
                                    position: "absolute",
                                    left: `${dropdownPos.left}px`, // "게시판" 탭 위치에 맞게 정렬
                                    transform: "translateX(-50%)", // 중앙 정렬
                                }}
                            >
                                <li className="p-2 hover:bg-gray-100">
                                    <Link href="/board">📌 공지사항</Link>
                                </li>
                                <li className="p-2 hover:bg-gray-100">
                                    <Link href="/photonews">📷 포토뉴스</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}


            </header>
            <main className={`flex-grow ${pathname === '/' ? '' : 'pt-20 pb-32'}`}>
                {children}
            </main>
            {pathname !== '/' && <FixedFooter />}
            {showAuthForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <AuthForm
                        onSubmit={handleAuthSubmit}
                        onCancel={() => setShowAuthForm(false)}
                    />
                </div>
            )}
            <MiniChatbot />
        </div>
    )
}
