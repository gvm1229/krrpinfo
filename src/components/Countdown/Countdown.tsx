'use client';

import ResponsiveImage from '@/components/Image/ResponsiveImage';

export const revalidate = 60;

interface CountdownProps {
  size?: string;
  bgColor?: string;
  targetDateStr: string;
}

const Countdown = ({
  size,
  bgColor = 'bg-yellow-600',
  targetDateStr,
}: CountdownProps) => {
  // Function to calculate the remaining days
  const calculateRemainingDays = (targetDate: Date): number => {
    const currentDate = new Date();
    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)) + 1;
    return differenceInDays > 0 ? differenceInDays : 0; // Ensure remainingDays is not negative
  };

  // Parse the target date string to create a Date object
  const targetDate = new Date(targetDateStr);
  // Initialize the remainingDays state with the initial value
  const remainingDays = calculateRemainingDays(targetDate);

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
      return '종료';

    return `종료까지: D-${remainingDays}`;
  };

  return (
    <main className={`size-full rounded-lg p-4 ${bgColor} ${size}`}>
      <div className="flex size-full flex-col items-center justify-center">
        <ResponsiveImage
          src="/assets/images/한섭/S24_타이틀_가공.png"
          alt="S24타이틀"
          gridNums={[2, 3, 3]}
          isPriority
        />
        <h1
          className="mt-4 text-center text-lg font-bold text-indigo-50 tablet:text-2xl"
          suppressHydrationWarning
        >
          {formatRemainingDays(remainingDays)}
        </h1>
        <p
          className="mt-2 text-center text-sm font-semibold text-indigo-50 tablet:text-lg"
          suppressHydrationWarning
        >
          {`(${formatDate(targetDateStr)})`}
        </p>
      </div>
    </main>
  );
};

export default Countdown;
