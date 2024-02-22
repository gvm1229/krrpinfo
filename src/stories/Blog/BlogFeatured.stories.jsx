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
  <div className="container relative flex h-screen w-screen items-center justify-center">
    <BlogFeatured {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  width: 'w-full',
  height: 'mobile:h-80 tablet:h-96 desktop:h-108',
  thumbnail: 'https://dummyimage.com/1280x720',
  category: 'Sample Category',
  title: 'Sample Title',
};
