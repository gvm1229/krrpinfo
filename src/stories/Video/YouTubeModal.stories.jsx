import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { YouTubeModalTrigger } from '@/components/Video/YouTubeModalTrigger';
import video1 from '@/content/youtubers/루밍밍/w1Rrw2T7Bz4.json';

export default {
  title: 'Components/Video/YouTubeModal',
  component: YouTubeModalTrigger,
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
      <div className="relative grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
        <YouTubeModalTrigger {...args} />
      </div>
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  videoData: video1,
};
