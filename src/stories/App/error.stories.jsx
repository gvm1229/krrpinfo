import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default {
  title: 'App/Error',
  component: Error,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

export const Template = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <div className="absolute inset-0 mx-8 flex items-center justify-center">
        <Card className="flex h-72 w-full flex-col items-center justify-center tablet:h-80 tablet:max-w-xl desktop:h-96 desktop:max-w-3xl">
          <CardHeader className="space-y-2 text-center tablet:space-y-4">
            <CardTitle className="text-4xl tablet:text-6xl desktop:text-7xl">Error</CardTitle>
            <h1 className="text-2xl font-medium tracking-tight tablet:text-3xl desktop:text-4xl">
              Something went wrong!
            </h1>
            <CardDescription className="pt-2 text-base tablet:text-xl desktop:text-2xl">
              I can't believe this
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button
              className="text-lg tablet:h-[3.25rem] tablet:text-xl"
            >
              Try again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </ThemeProvider>
);
