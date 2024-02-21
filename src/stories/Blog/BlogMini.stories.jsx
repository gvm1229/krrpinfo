import React from 'react';
import BlogMini from '@/src/components/Blog/BlogMini';

export default {
  title: 'Components/Blog/BlogMini',
  component: BlogMini,
  argTypes: {
    // Define default argTypes here
  },
};

const Template = (args) => (
  <div className="container size-full">
    <BlogMini {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
