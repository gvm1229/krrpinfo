import React from 'react';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';

export default {
  title: 'Components/Button/ButtonNewTab',
  component: ButtonNewTab,
  argTypes: {
    // Define default argTypes here
  },
};

const Template = (args) => (
  <div className="container size-full">
    <ButtonNewTab {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
