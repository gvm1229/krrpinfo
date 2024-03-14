import { MailOpen } from 'lucide-react';
import React from 'react';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { Button } from '@/components/ui/button';

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
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <ButtonNewTab {...args} />
    </div>
  </ThemeProvider>
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
