import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  cnUpdateInput,
  ingestCnUpdate,
  pendingTranslations,
  saveTranslation,
  translationInput,
  validToken,
} from '@/src/cms/cn-ingest';

// 이미지 병렬 복사 상한 시간
export const maxDuration = 60;
// 중국 서버 업데이트 수신, 결과는 항상 Draft
export const POST = async (request: Request) => {
  if (!validToken(request.headers.get('authorization')))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = cnUpdateInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'invalid input', issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    const result = await ingestCnUpdate(parsed.data);
    if (!result.duplicate) revalidatePath('/admin');
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
  } catch (error) {
    console.error(`[cn-update::POST] ${error}`);
    return NextResponse.json({ error: 'save failed' }, { status: 500 });
  }
};

// 번역 대기 Draft 목록
export const GET = async (request: Request) => {
  if (!validToken(request.headers.get('authorization')))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ pending: await pendingTranslations() });
  } catch (error) {
    console.error(`[cn-update::GET] ${error}`);
    return NextResponse.json({ error: 'load failed' }, { status: 500 });
  }
};

// 번역 결과 저장, Published 항목은 변경 안 함
export const PATCH = async (request: Request) => {
  if (!validToken(request.headers.get('authorization')))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = translationInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'invalid input', issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    if (!(await saveTranslation(parsed.data)))
      return NextResponse.json({ error: 'not found or already published' }, { status: 404 });
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[cn-update::PATCH] ${error}`);
    return NextResponse.json({ error: 'save failed' }, { status: 500 });
  }
};
