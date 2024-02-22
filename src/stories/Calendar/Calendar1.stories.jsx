import React from 'react';
import Calendar1 from '@/src/components/Calendar/Calendar1';

export default {
  title: 'Components/Calendar/Calendar1',
  component: Calendar1,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container flex h-screen w-screen items-center justify-center">
    <Calendar1 {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
