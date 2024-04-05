import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { YouTubeModal } from '@/components/Video/YouTubeModal';
import { allVideos_UC2k5P3gHLWmqDHmyG5iLNfQ as video1 } from '@/content/youtubers/UC2k5P3gHLWmqDHmyG5iLNfQ';

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

export const Default = Template.bind({});
Default.args = {
  videoData: video1[0],
};
