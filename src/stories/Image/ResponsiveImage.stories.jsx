import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import s24BannerKr from '@/public/assets/images/한섭/S24_아리아.png';

export default {
  title: 'Components/Image/ResponsiveImage',
  component: ResponsiveImage,
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
      <ResponsiveImage {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // src: 'https://dummyimage.com/1280x720',
  src: s24BannerKr,
  alt: 'responsive dummy',
  wrapperClassName: 'border-2 border-black dark:border-white',
};
