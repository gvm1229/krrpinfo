import React from 'react';
import FileButton from '@/src/components/Button/FileButton';

export default {
  title: 'Components/Button/FileButton',
  component: FileButton,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container relative flex h-screen w-screen items-center justify-center">
    <FileButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'PNG',
};
