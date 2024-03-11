import React from 'react';
import hdDummy from '@/public/assets/storybook/720p.png';
import SimpleFeatured from '@/src/components/Card/SimpleFeatured';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';

export default {
  title: 'Components/Card/SimpleFeatured',
  component: SimpleFeatured,
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
      <SimpleFeatured {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
  thumbnail: hdDummy,
};
