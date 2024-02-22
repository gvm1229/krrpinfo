import React from 'react';
import BlogFeatured from '@/src/components/Blog/BlogFeatured';

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
  <div className="container flex h-screen w-screen items-center justify-center">
    <BlogFeatured {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
