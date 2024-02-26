import React from 'react';
import hdDummy from '@/public/assets/storybook/720p.png';
import BlogFeatured from '@/src/components/Blog/BlogFeatured';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';

export default {
  title: 'Components/Blog/BlogFeatured',
  component: BlogFeatured,
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
      <BlogFeatured {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  thumbnail: hdDummy,
};
