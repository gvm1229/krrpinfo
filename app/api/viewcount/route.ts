import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const redis = Redis.fromEnv();

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'POST')
    return new NextResponse('use POST', { status: 405 });

  if (request.headers.get('Content-Type') !== 'application/json')
    return new NextResponse('must be json', { status: 400 });

  const body = await request.json();
  const slug = body.slug as string | undefined;

  if (!slug) return new NextResponse('Slug not found', { status: 400 });

  const ip = request.ip ?? request.headers.get('X-Forwarded-For');

  if (ip) {
    // Hash the IP and turn it into a hex string
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const isNewView = await redis.set(
      ['deduplicate', hash, slug].join(':'),
      true,
      {
        nx: true,
        ex: 60 * 60,
      },
    );
    if (!isNewView) return new NextResponse(null, { status: 202 });
  }

  await redis.incr(['pageviews', 'projects', slug].join(':'));

  return new NextResponse(null, { status: 202 });
}
