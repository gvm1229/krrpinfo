import { permanentRedirect } from 'next/navigation';
// 폐지된 채널 주소와 이전 영상 주소 연결
const LegacyVideoPage = async ({ params }: { params: Promise<{ legacy?: string[] }> }) => {
  const path = (await params).legacy ?? [];
  const candidate = path.find((part) => part.startsWith('_'))?.slice(1);
  if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate))
    permanentRedirect('https://www.youtube.com/watch?v=' + candidate);
  permanentRedirect('/videos');
};
export default LegacyVideoPage;
