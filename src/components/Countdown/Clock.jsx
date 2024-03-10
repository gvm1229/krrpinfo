'use client';

import { useState, useEffect } from 'react';

const Clock = ({
  size,
  bgColor,
}) => {
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
      <h2 className="text-4xl font-bold">현재 시각:</h2>
      <p className="mt-2 text-2xl">{currentTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default Clock;
