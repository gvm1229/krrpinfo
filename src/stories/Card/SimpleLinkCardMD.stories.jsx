import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { SimpleLinkCardMD } from '@/src/components/Card/SimpleLinkCard';

export default {
  title: 'Components/Card/SimpleLinkCardMD',
  component: SimpleLinkCardMD,
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
      <SimpleLinkCardMD {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
  title: 'Sample Title',
  tags: ['Sample Tag', 'Sample Tag', 'Sample Tag'],
  className: 'max-w-80',
};
