'use client';

// Error components must be Client Components

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/src/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="absolute inset-0 mx-8 flex items-center justify-center">
      <Card className="flex h-72 w-full flex-col items-center justify-center tablet:h-80 tablet:max-w-xl desktop:h-96 desktop:max-w-3xl">
        <CardHeader className="space-y-2 text-center tablet:space-y-4">
          <CardTitle className="text-4xl tablet:text-6xl desktop:text-7xl">Error</CardTitle>
          <h1 className="text-2xl font-medium tracking-tight tablet:text-3xl desktop:text-4xl">
            Something went wrong!
          </h1>
          <CardDescription className="pt-2 text-base tablet:text-xl desktop:text-2xl">
            {error.message}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="text-lg tablet:h-[3.25rem] tablet:text-xl"
          >
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
