import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { collectTapTap } from '@/src/cms/taptap-collect';

// 상세 요청 간격과 이미지 복사 상한 시간
export const maxDuration = 60;

// Vercel Cron의 CRON_SECRET Bearer 확인
const authorized = (header: string | null) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16 || !header?.startsWith('Bearer ')) return false;
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(header.slice(7)), digest(secret));
};

// 매일 TapTap 공식 공지 수집
export const GET = async (request: Request) => {
  if (!authorized(request.headers.get('authorization')))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const report = await collectTapTap();
    if (report.saved.length) revalidatePath('/admin');
    return NextResponse.json(report, { status: report.listFailed ? 502 : 200 });
  } catch (error) {
    console.error(`[cron-taptap::GET] ${error}`);
    return NextResponse.json({ error: 'collect failed' }, { status: 500 });
  }
};
