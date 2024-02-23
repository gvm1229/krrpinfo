import React from 'react';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';
import { SiteFooter } from '@/src/components/Footer/SiteFooter';

export default {
  title: 'Components/Footer/SiteFooter',
  component: SiteFooter,
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
      <div className="absolute right-0 top-10">
        <ModeToggle />
      </div>
      <SiteFooter {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  className: 'border-t bg-background',
};
