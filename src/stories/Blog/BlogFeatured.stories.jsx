import React from 'react';
import BlogFeatured from '@/src/components/Blog/BlogFeatured';

export default {
  title: 'Components/Blog/BlogFeatured',
  component: BlogFeatured,
  argTypes: {
    // Define default argTypes here
  },
};

const Template = (args) => (
  <div className="container size-full">
    <BlogFeatured {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
