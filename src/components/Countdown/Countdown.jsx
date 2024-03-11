'use client';

import { useEffect, useState } from 'react';
import S24Title from '@/public/assets/images/한섭/S24_타이틀_가공.png';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';

export const revalidate = 10;

const Countdown = ({
  size = 'size-64',
  bgColor = 'bg-yellow-600',
  targetDateStr,
}) => {
  const [
    remainingDays,
    setRemainingDays,
  ] = useState(0);

  // Function to format the date from 'MM/DD/YYYY' to 'YYYY/MM/DD'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    return `${year}/${month}/${day}`;
  };

  const formatRemainingDays = (remainingDaysInput) => {
    if (remainingDaysInput <= 0)
      return '종료';

    return `종료까지: D-${remainingDays}`;
  };

  useEffect(() => {
    // Parse the target date string to create a Date object
    const targetDate = new Date(targetDateStr);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in days (+ target date)
    const differenceInDays = Math.floor((targetDate - currentDate) / (1000 * 60 * 60 * 24)) + 1;

    // Update the state with the remaining days
    setRemainingDays(differenceInDays);
  }, [targetDateStr]);

  return (
    <main className={`size-full rounded-lg p-2 ${bgColor} ${size}`}>
      <div className="flex size-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-white p-4 ">
        <ResponsiveImage
          src={S24Title}
          alt="S24타이틀"
          isPriority
        />
        <h1
          className="text-center text-2xl font-bold text-indigo-50"
          suppressHydrationWarning
        >
          {formatRemainingDays(remainingDays)}
        </h1>
        <p
          className="text-center text-lg font-semibold text-indigo-50"
          suppressHydrationWarning
        >
          {`(${formatDate(targetDateStr)})`}
        </p>
      </div>
    </main>
  );
};

export default Countdown;
