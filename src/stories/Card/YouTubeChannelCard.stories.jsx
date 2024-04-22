import React from 'react';
import YouTubeChannelCard from '@/components/Card/YouTubeChannelCard';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';

export default {
  title: 'Components/Card/YouTubeChannelCard',
  component: YouTubeChannelCard,
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
      <div className="w-full max-w-96">
        <YouTubeChannelCard {...args} />
      </div>
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  title: 'sample title',
  description: 'sample description',
};
