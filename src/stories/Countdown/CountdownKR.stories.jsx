import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import s24Title from '@/public/assets/images/한섭/S24_타이틀_가공.png';
import CountdownKR from '@/src/components/Countdown/CountdownKR';

export default {
  title: 'Components/Countdown/CountdownKR',
  component: CountdownKR,
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
      <CountdownKR {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
  size: 'size-44',
  seasons: [
    {
      seasonNum: 24,
      src: s24Title,
      alt: 'S24타이틀',
      targetEndDate: '4/17/2024',
      bgFromColor: 'from-amber-600',
      bgToColor: 'to-amber-300',
    },
    {
      seasonNum: 25,
      src: s24Title,
      alt: 'S25타이틀',
      targetEndDate: '6/20/2024',
      bgFromColor: 'from-purple-600',
      bgToColor: 'to-purple-300',
    },
  ],
};
