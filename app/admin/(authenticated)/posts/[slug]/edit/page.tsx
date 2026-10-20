import { redirect, notFound } from 'next/navigation';
import { adminEntries } from '@/src/cms/repository';
// 이전 편집 주소 연결
const EditPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const entry = (await adminEntries('post')).find((entry) => entry.slug === slug);
  if (!entry) notFound();
  redirect('/admin/content/post/' + entry.id);
};
export default EditPostPage;
