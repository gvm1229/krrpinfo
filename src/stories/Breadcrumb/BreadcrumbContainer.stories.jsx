import React from 'react';
import BreadcrumbContainer from '@/components/Breadcrumb/BreadcrumbContainer';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';

export default {
  title: 'Components/Breadcrumb/BreadcrumbContainer',
  component: BreadcrumbContainer,
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
      <BreadcrumbContainer {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
  itemsInput: [{ url: '/posts', label: '포스트' }],
};
