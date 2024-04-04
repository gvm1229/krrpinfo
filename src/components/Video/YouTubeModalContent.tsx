'use client';

import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, convertSecondsToTime } from '@/src/util/utils';

interface YouTubeModalContentProps {
  videoId: string;
  className?: string;
}

interface TimeStamp {
  title: string;
  seconds: number;
}

const YouTubeModalContent = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  videoId,
  className,
}: YouTubeModalContentProps) => {
  const playerRef = React.useRef(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);

  const timestamps: TimeStamp[] = [
    {
      title: 'Start',
      seconds: 0,
    },
    {
      title: 'Snake',
      seconds: 6.847,
    },
    {
      title: 'Sloth',
      seconds: 12.764,
    },
    {
      title: 'Ants',
      seconds: 27.311,
    },
    {
      title: 'Frog',
      seconds: 34,
    },
    {
      title: 'Snake 2',
      seconds: 42.532,
    },
    {
      title: 'Turtle',
      seconds: 56.452,
    },
    {
      title: 'Lizard',
      seconds: 61.934,
    },
    {
      title: 'Snake 3',
      seconds: 72.353,
    },
    {
      title: 'Frog 2',
      seconds: 81.904,
    },
    {
      title: 'Parrot',
      seconds: 90.273,
    },
  ];

  const updateCurrentTime = () => {
    setCurrentTime(
      playerRef.current.getCurrentTime()
        ? playerRef.current.getCurrentTime().toFixed(3)
        : 0,
    );
  };

  const isWithinInterval = (indexInput: number) => {
    const currentTimeStamp = timestamps[indexInput].seconds;

    if (indexInput === timestamps.length - 1)
      return currentTimeStamp <= currentTime;

    const nextTimeStamp = timestamps[indexInput + 1].seconds;

    return currentTimeStamp <= currentTime && currentTime < nextTimeStamp;
  };

  useEffect(() => {
    let interval = null;
    if (playing)
      interval = setInterval(() => {
        if (playerRef.current) updateCurrentTime();
      }, 1000);
    else if (!playing && interval) clearInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing]);

  return (
    <main
      className={cn(
        'relative flex flex-col justify-start gap-8 laptop:flex-row desktop:gap-12',
        className,
      )}
    >
      <div className="relative aspect-video laptop:h-[50vh]">
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
          controls
          light={false} // for thumbnail-only load
          width="100%"
          height="100%"
          onStart={() => {
            updateCurrentTime();
            setPlaying(true);
          }}
          onPlay={() => {
            updateCurrentTime();
            setPlaying(true);
          }}
          onPause={() => {
            updateCurrentTime();
            setPlaying(false);
          }}
          onSeek={() => {
            updateCurrentTime();
            setPlaying(false);
          }}
          onEnded={() => {
            updateCurrentTime();
            setPlaying(false);
          }}
        />
      </div>
      <div className="relative flex flex-col overflow-hidden rounded-lg border-2 border-zinc-400 dark:border-zinc-600 laptop:w-full">
        <div className="p-4 dark:bg-zinc-600">
          <h1 className="text-lg font-medium tablet:text-xl">챕터</h1>
        </div>
        <ScrollArea className="flex h-48 flex-col overflow-hidden laptop:h-[43vh] laptop:min-w-80">
          {timestamps.map((timestamp, idx) => (
            <button
              key={timestamp.title}
              className={cn(
                'flex w-full flex-col items-start px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 tablet:p-4',
                isWithinInterval(idx) && 'bg-zinc-100 dark:bg-zinc-800',
              )}
              onClick={() => {
                playerRef.current?.seekTo(timestamp.seconds);
                setCurrentTime(timestamp.seconds);
              }}
            >
              <h1 className="text-base font-medium tablet:text-lg">
                {timestamp.title}
              </h1>
              <p className="mt-2 rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base">
                {convertSecondsToTime(timestamp.seconds)}
              </p>
            </button>
          ))}
        </ScrollArea>
      </div>
    </main>
  );
};

export default YouTubeModalContent;
