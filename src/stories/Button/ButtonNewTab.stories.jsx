import { MailOpen } from 'lucide-react';
import React from 'react';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';
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
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-0 top-10">
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
