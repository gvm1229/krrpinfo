import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import CountdownCN from '@/src/components/Countdown/CountdownCN';

export default {
  title: 'Components/Countdown/CountdownCN',
  component: CountdownCN,
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
      <CountdownCN {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
  size: 'size-44',
  seasons: [
    {
      seasonNum: 29,
      targetEndDate: '3/27/2024',
      bgFromColor: 'from-cyan-600',
      bgToColor: 'to-cyan-300',
    },
    {
      seasonNum: 30,
      targetEndDate: '5/27/2024',
      bgFromColor: 'from-indigo-600',
      bgToColor: 'to-indigo-300',
    },
  ],
};
