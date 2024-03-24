import React from 'react';
import BlogFeatured from '@/components/Blog/BlogFeatured';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';

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
  // Define default props here
};
