import React from 'react';
import Card3D from '@/src/components/Card/Card3D';

export default {
  title: 'Components/Card/Card3D',
  component: Card3D,
};

const Template = (args) => (
  <div className="size-96 translate-y-96">
    <Card3D {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
