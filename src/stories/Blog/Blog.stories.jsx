import React from 'react';
import Blog from '@/src/components/Blog/Blog';

export default {
  title: 'Components/Blog/Blog',
  component: Blog,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container relative flex h-screen w-screen items-center justify-center">
    <Blog {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
