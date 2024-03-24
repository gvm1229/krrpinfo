'use client';

import ResponsiveImage from '@/components/Image/ResponsiveImage';
import { cn } from '@/src/util/utils';

export const revalidate = 60;

interface CountdownProps {
  seasons: {
    targetEndDate: string;
    countdownUntilEnd: boolean;
    seasonNum?: number;
    src?: string;
    alt?: string;
    title?: string;
    description?: string;
    bgFromColor: string;
    bgToColor: string;
  }[];
  className?: string;
}

const Countdown = ({
  seasons,
  className,
}: CountdownProps) => {
  // Function to calculate the remaining days
  const calculateRemainingDays = (targetDate: Date): number => {
    const currentDate = new Date();
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)) + 1;
    return differenceInDays > 0 ? differenceInDays : 0; // Ensure remainingDays is not negative
  };

  // Function to format the date from 'MM/DD/YYYY' to 'YYYY/MM/DD'
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    return `${year}/${month}/${day}`;
  };

  const formatRemainingDays = (remainingDaysInput: number): string => {
    if (remainingDaysInput <= 0)
      return 'D-DAY';

    return `D-${remainingDaysInput}`;
  };

  // Find the current season based on the current date
  const currentDate = new Date();
  let currentSeason = seasons.find((season) => {
    const seasonEndDate = new Date(season.targetEndDate);
    // seasonEndDate +1 to include d-day
    seasonEndDate.setDate(seasonEndDate.getDate() + 1);
    return seasonEndDate >= currentDate;
  });

  if (!currentSeason)
  // If no current season found, default to the last season
    currentSeason = seasons[seasons.length - 1];

  const targetDate = new Date(currentSeason.targetEndDate);
  const remainingDays = calculateRemainingDays(targetDate);

  return (
    <main className={cn(`aspect-square shrink-0 rounded-xl bg-gradient-to-tr p-3 ${currentSeason.bgFromColor} ${currentSeason.bgToColor}`, className)}>
      <div className="grid size-full auto-rows-auto">
        <div className="self-start tablet:self-center">
          {currentSeason.src ? (
            <ResponsiveImage
              src={currentSeason.src}
              alt={currentSeason.alt}
              gridNums={[2, 3, 6]}
              imageClassName="max-h-32"
              objectFit="object-contain"
              isPriority
            />
          ) : (
            <div>
              <h1
                className="flex-wrap text-left text-2xl font-bold text-white tablet:text-3xl"
              >
                {currentSeason.title || currentSeason.alt || 'NULL TITLE'}
              </h1>
              {currentSeason.description && (
                <p
                  className="mt-1 text-left text-base font-semibold text-white/90"
                >
                  {currentSeason.description}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="self-end">
          {(currentSeason.src && currentSeason.description) && (
            <p
              className="mb-1 text-left text-base font-semibold text-white/90"
            >
              {currentSeason.description}
            </p>
          )}
          <h1
            className="text-left text-lg font-semibold text-white/90"
          >
            {currentSeason.countdownUntilEnd ? '종료까지:' : '출시까지:'}
          </h1>
          <h1
            className="-my-1 text-left text-4xl font-extrabold text-white"
            suppressHydrationWarning
          >
            {formatRemainingDays(remainingDays)}
          </h1>
          <p
            className="text-left text-base font-medium text-white/90"
            suppressHydrationWarning
          >
            {`(${formatDate(currentSeason.targetEndDate)})`}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Countdown;
