import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/src/auth';

// Next.js 16 proxy 는 항상 Node runtime — MongoDB adapter 호환
const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/auth-error']);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. /admin/* 보호 — login/auth-error 제외하고 owner 세션 필수
  if (pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. youtubers 노출 gate
  if (pathname.startsWith('/youtubers') && process.env.NEXT_PUBLIC_SHOW_YOUTUBERS !== 'true') {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/youtubers', '/youtubers/:path*'],
};
