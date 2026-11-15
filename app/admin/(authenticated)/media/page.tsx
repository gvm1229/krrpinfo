import { adminMedia } from '@/src/cms/repository';
import { MediaManager } from '@/components/Admin/MediaManager';
// 운영자 미디어 목록
const MediaPage = async () => <MediaManager items={await adminMedia()} />;
export default MediaPage;
