import { siteSettings, adminMedia, requireOwner } from '@/src/cms/repository';
import { SettingsForm } from '@/components/Admin/SettingsForm';
// 사이트 설정 화면
const ConfigPage = async () => {
  await requireOwner();
  const [initial, media] = await Promise.all([siteSettings(), adminMedia()]);
  return <SettingsForm initial={initial} media={media} />;
};
export default ConfigPage;
