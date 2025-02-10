import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const host = req.headers.get('host');
    const url = req.nextUrl.clone();
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost';

    // admin.hostname:3000 서브도메인에서 /admin 경로로 접근하면 정상 처리
    if (host === `admin.${hostname}:3000`) {
        if (!url.pathname.startsWith('/admin')) {
            // /admin 경로로 리디렉션
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // hostname:3000에서 /admin 경로로 접근하면 홈으로 리디렉션
    if (host === `${hostname}:3000` && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url)); // 홈 페이지로 리디렉션
    }

    return NextResponse.next(); // 다른 경로들은 정상 처리
}
