import React from 'react';
import BlogMini from '@/src/components/Blog/BlogMini';

export default {
  title: 'Components/Blog/BlogMini',
  component: BlogMini,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container relative flex h-screen w-screen items-center justify-center">
    <BlogMini {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  height: 'h-20',
  thumbnail: 'https://dummyimage.com/1280x720',
  category: 'Sample Category',
  title: 'Sample Title',
};
