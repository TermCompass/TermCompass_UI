'use client'

import { useState, useEffect } from 'react'
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

    // 로그인한 사용자만 접근 가능한 페이지 목록
    const authenticatedPaths = [
        '/create-terms',
        '/modify-terms',
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
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const businessOnlyPaths = ['/create-terms', '/modify-terms', '/business-history']
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
                    { href: '/modify-terms', label: '약관 수정' },
                ]
                : [
                ]
            : []
        ),
        { href: '/board', label: '게시판' },
        ...(user ? [{ href: "/my-page", label: "마이페이지", icon: User }] : []),
    ]

    const handleAuthSubmit = (
        id: number,
        name: string,
        email: string,
        userType: 'PERSONAL' | 'COMPANY',
        created_at: string,
        businessNumber: string,
        isLogin: boolean
    ) => {
        login( id, name, email, userType, created_at, businessNumber )
        setShowAuthForm(false)
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include', // 쿠키를 포함한 요청
            });

            if (!response.ok) {
                throw new Error('로그아웃 실패');
            }

            // 쿠키 삭제
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";

            // 로그아웃 성공 후 처리
            logout()
            router.push('/'); // 홈으로 리다이렉트
        } catch (error) {
            // @ts-ignore
            alert(error.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

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
                                <ul className="flex space-x-6">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`relative py-2 transition-colors duration-300 ${
                                                    pathname === '/' && isTransparent
                                                        ? 'text-white font-bold'
                                                        : 'text-gray-900 font-bold'
                                                } group`}
                                            >
                                                {item.label}
                                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${
                                                    pathname === '/' && isTransparent
                                                        ? 'bg-white'
                                                        : 'bg-blue-600'
                                                } transition-all duration-300 group-hover:w-full ${
                                                    pathname === item.href ? 'w-full' : ''
                                                }`}></span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            {user ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className={`transition-all duration-300 ${
                                        pathname === '/' && isTransparent
                                            ? 'bg-transparent border-white text-white hover:bg-white/10'
                                            : 'bg-white text-blue-700 hover:bg-blue-100'
                                    }`}
                                >
                                    로그아웃
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setShowAuthForm(true)}
                                    variant="outline"
                                    className={`transition-all duration-300 ${
                                        pathname === '/' && isTransparent
                                            ? 'bg-transparent border-white text-white hover:bg-white/10'
                                            : 'bg-white text-blue-700 hover:bg-blue-100'
                                    }`}
                                >
                                    로그인 / 회원가입
                                </Button>
                            )}
                        </>
                    )}
                </div>
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
