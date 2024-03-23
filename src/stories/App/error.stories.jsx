import { Home } from 'lucide-react';
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
      <div className="container relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="flex w-full flex-col items-center justify-center">
            <CardHeader className="space-y-2 text-center tablet:space-y-4 tablet:pt-12">
              <CardTitle className="text-4xl tablet:text-6xl desktop:text-7xl">오류</CardTitle>
              <h1 className="text-2xl font-medium tracking-tight tablet:text-3xl desktop:text-4xl">
                무언가가 잘못되었습니다!
              </h1>
              <CardDescription className="pt-2 text-base tablet:text-xl desktop:text-2xl">
                Something went wrong...
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center tablet:pb-12">
              <Button
                className="flex items-center gap-3 text-lg tablet:h-[3.25rem] tablet:text-xl"
              >
                <Home className="size-4 tablet:size-6" />
                홈 화면으로 돌아가기
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </ThemeProvider>
);
