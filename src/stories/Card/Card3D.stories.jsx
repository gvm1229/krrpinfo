import React from 'react';
import Card3D from '@/src/components/Card/Card3D';

export default {
  title: 'Components/Card/Card3D',
  component: Card3D,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container flex h-screen w-screen items-center justify-center">
    <Card3D {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  popupTitleImageClassName: 'mb-3',
};
