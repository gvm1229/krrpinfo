import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cnUpdateInput, ingestCnUpdate, validToken } from '@/src/cms/cn-ingest';

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
