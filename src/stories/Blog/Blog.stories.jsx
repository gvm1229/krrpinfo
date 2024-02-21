import React from 'react';
import Blog from '@/src/components/Blog/Blog';

export default {
  title: 'Components/Blog/Blog',
  component: Blog,
  argTypes: {
    // Define default argTypes here
  },
};

const Template = (args) => (
  <div className="container size-full">
    <Blog {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
