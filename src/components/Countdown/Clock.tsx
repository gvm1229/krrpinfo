'use client';

import { useEffect, useState } from 'react';

interface ClockProps {
  size?: string;
  bgColor?: string;
}

const Clock = ({
  size,
  bgColor,
}: ClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const tick = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${size} ${bgColor}`}>
      <h2 className="text-3xl font-bold tablet:text-4xl">현재 시각:</h2>
      <p
        className="mt-2 text-xl tablet:text-2xl"
        suppressHydrationWarning
      >
        {currentTime.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default Clock;
