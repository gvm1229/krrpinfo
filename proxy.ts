import { NextResponse, type NextRequest } from 'next/server';

// youtubers 노출 gate
export function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SHOW_YOUTUBERS !== 'true') {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/youtubers', '/youtubers/:path*'],
};
