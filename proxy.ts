import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/src/auth';
import { isOwner } from '@/src/cms/owner';
const publicAdminPaths = new Set(['/admin/login', '/admin/auth-error']);
// 관리자 경로의 세션 확인
export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && !publicAdminPaths.has(pathname) && !isOwner(await auth()))
    return NextResponse.redirect(new URL('/admin/login', request.url));
  if (pathname.startsWith('/youtubers') && process.env.NEXT_PUBLIC_SHOW_YOUTUBERS !== 'true')
    return new NextResponse(null, { status: 404 });
  return NextResponse.next();
};
export const config = { matcher: ['/admin/:path*', '/youtubers/:path*'] };
