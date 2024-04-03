'use client';

import React from 'react';
import ReactPlayer from 'react-player/youtube';
import { buttonVariants } from '@/components/ui/button';
import { cn, convertSecondsToTime } from '@/src/util/utils';

interface YouTubeModalContentProps {
  videoId: string;
}

interface TimeStamp {
  title: string;
  seconds: number;
}

const YouTubeModalContent = ({
  videoId,
}: YouTubeModalContentProps) => {
  const playerRef = React.useRef(null);
  const [currentTime, setCurrentTime] = React.useState(0);

  const timestamps: TimeStamp[] = [
    {
      title: 'Frog',
      seconds: 34,
    },
    {
      title: 'Parrot',
      seconds: 90.273,
    },
    {
      title: 'Bird',
      seconds: 601,
    },
  ];

  return (
    <main className="flex flex-col gap-8 laptop:flex-row">
      <div className="aspect-video max-h-[50vh] w-auto">
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${videoId}"`}
          controls
          light={false} // for thumbnail-only load
          width="100%"
          height="100%"
        />
      </div>
      <div className="">
        <div className="mt-4 flex flex-col justify-center gap-4">
          <p className="text-lg font-medium">
            Current video time in seconds:
            {' '}
            {currentTime}
          </p>
          <button
            className={cn(buttonVariants())}
            onClick={() => {
              setCurrentTime(
                playerRef.current.getCurrentTime().toFixed(3),
              );
            }}
          >
            Refresh duration
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {timestamps.map((timestamp) => (
            <div
              key={timestamp.title}
              className="flex items-center gap-2"
            >
              <button
                className="w-20 text-left text-lg font-medium text-blue-600 decoration-2 underline-offset-2 hover:underline"
                onClick={() => {
                  playerRef.current?.seekTo(timestamp.seconds);
                }}
              >
                {convertSecondsToTime(timestamp.seconds)}
              </button>
              <p
                className="text-lg font-medium"
              >
                {timestamp.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default YouTubeModalContent;
