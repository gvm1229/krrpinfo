import { MailOpen } from 'lucide-react';
import React from 'react';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import { Button } from '@/src/components/ui/button';

export default {
  title: 'Components/Button/ButtonNewTab',
  component: ButtonNewTab,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <div className="container size-full">
    <ButtonNewTab {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <Button className="flex gap-4">
      <MailOpen />
      Login with Email
    </Button>
  ),
  href: 'https://gmail.com',
};
