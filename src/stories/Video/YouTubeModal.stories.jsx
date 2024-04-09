import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { YouTubeModal } from '@/components/Video/YouTubeModal';

export default {
  title: 'Components/Video/YouTubeModal',
  component: YouTubeModal,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
        <YouTubeModal {...args} />
      </div>
    </div>
  </ThemeProvider>
);

const video = {
  kind: 'youtube#video',
  etag: 'Zg-xNQHYQ39xCys0D1BIq1H4IFI',
  id: 'by77MxjPg1g',
  snippet: {
    publishedAt: '2024-03-29T07:15:03Z',
    channelId: 'UCY74n-XQJ69dxNdN7h71wLg',
    title: '대장차 없는분들 꼭사세요 미친 플펫 나왔습니다',
    description: '생방송 - https://chzzk.naver.com/22606f1ee5a444d63ccc49fbec69383d\n인스타그램 - https://instagram.com/runmingi\n비즈니스 관련 문의 - runmingiyt@gmail.com\n\n- \n\n#런민기 #카러플 #플라잉선인장',
    thumbnails: {
      default: {
        url: 'https://i.ytimg.com/vi/by77MxjPg1g/default.jpg',
        width: 120,
        height: 90,
      },
      medium: {
        url: 'https://i.ytimg.com/vi/by77MxjPg1g/mqdefault.jpg',
        width: 320,
        height: 180,
      },
      high: {
        url: 'https://i.ytimg.com/vi/by77MxjPg1g/hqdefault.jpg',
        width: 480,
        height: 360,
      },
      standard: {
        url: 'https://i.ytimg.com/vi/by77MxjPg1g/sddefault.jpg',
        width: 640,
        height: 480,
      },
      maxres: {
        url: 'https://i.ytimg.com/vi/by77MxjPg1g/maxresdefault.jpg',
        width: 1280,
        height: 720,
      },
    },
    channelTitle: '런민기',
    categoryId: '20',
    liveBroadcastContent: 'none',
    localized: {
      title: '대장차 없는분들 꼭사세요 미친 플펫 나왔습니다',
      description: '생방송 - https://chzzk.naver.com/22606f1ee5a444d63ccc49fbec69383d\n인스타그램 - https://instagram.com/runmingi\n비즈니스 관련 문의 - runmingiyt@gmail.com\n\n- \n\n#런민기 #카러플 #플라잉선인장',
    },
  },
};

export const Default = Template.bind({});
Default.args = {
  videoData: video,
};
