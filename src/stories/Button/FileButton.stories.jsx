import React from 'react';
import FileButton from '@/src/components/Button/FileButton';

export default {
  title: 'Components/Button/FileButton',
  component: FileButton,
  argTypes: {
    // Define default argTypes here
  },
};

const Template = (args) => (
  <div className="container size-full">
    <FileButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
