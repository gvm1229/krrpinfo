import React from 'react';
import hdDummy from '@/public/assets/storybook/720p.png';
import Blog from '@/src/components/Blog/Blog';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';

export default {
  title: 'Components/Blog/Blog',
  component: Blog,
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
      <Blog {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  width: 'min-w-80',
  thumbnail: hdDummy,
  category: 'Sample Category',
  date: '2024/1/11',
  title: 'Sample Title',
};
