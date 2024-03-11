'use client';

import Image from 'next/image';
import S24Title from '@/public/assets/images/한섭/S24_타이틀_가공.png';

export const revalidate = 60;

const Countdown = ({
  size = 'size-64',
  bgColor = 'bg-yellow-600',
  targetDateStr,
}) => {
  // Function to calculate the remaining days
  const calculateRemainingDays = (targetDate) => {
    const currentDate = new Date();
    const differenceInDays = Math.floor((targetDate - currentDate) / (1000 * 60 * 60 * 24)) + 1;
    return differenceInDays > 0 ? differenceInDays : 0; // Ensure remainingDays is not negative
  };

  // Parse the target date string to create a Date object
  const targetDate = new Date(targetDateStr);
  // Initialize the remainingDays state with the initial value
  const remainingDays = calculateRemainingDays(targetDate);

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

  return (
    <main className={`size-full rounded-lg p-2 ${bgColor} ${size}`}>
      <div className="flex size-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-white p-4 ">
        <Image
          src={S24Title}
          alt="S24타이틀"
          width={372}
          height={144}
          priority
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
