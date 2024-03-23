'use client';

import ResponsiveImage from '@/components/Image/ResponsiveImage';

export const revalidate = 60;

interface CountdownProps {
  size?: string;
  seasons: {
    src?: string;
    alt?: string;
    seasonNum: number;
    targetEndDate: string;
    bgFromColor?: string;
    bgToColor?: string;
  }[];
}

const CountdownKR = ({
  size = 'size-full',
  seasons,
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
      return 'D-0, 종료';

    return `D-${remainingDaysInput}`;
  };

  // Find the current season based on the current date
  const currentDate = new Date();
  let currentSeason = seasons.find((season) => new Date(season.targetEndDate) >= currentDate);

  if (!currentSeason)
  // If no current season found, default to the last season
    currentSeason = seasons[seasons.length - 1];

  const targetDate = new Date(currentSeason.targetEndDate);
  const remainingDays = calculateRemainingDays(targetDate);

  return (
    <main className={`aspect-square rounded-[1rem] bg-gradient-to-tr p-3 ${currentSeason.bgFromColor} ${currentSeason.bgToColor} ${size}`}>
      <div className="grid size-full grid-rows-7">
        <div className="row-span-3">
          <ResponsiveImage
            src={currentSeason.src}
            alt={currentSeason.alt}
            gridNums={[2, 3, 3]}
            isPriority
          />
        </div>
        <div className="row-span-4 self-end">
          <h1
            className="text-left text-lg font-semibold text-white/90"
          >
            종료까지:
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

export default CountdownKR;
