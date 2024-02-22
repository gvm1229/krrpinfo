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
  <div className="container flex h-screen w-screen items-center justify-center">
    <BlogMini {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
