import React from 'react';
import BlogFeatured from '@/components/Blog/BlogFeatured';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import thumbnail from '@/public/assets/images/S28/시즌배너.webp';

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
  thumbnail,
  lastEditDate: '4/17/2024',
  title: '향후 시즌 미리보기',
  description: '중국 서버는 한국 서버에 비해 약 10개월 (5시즌) 이 앞서있습니다. 미래에는 어떤 카트, 캐릭터 등이 등장할지 미리 알아보세요.',
  className: 'container',
};
