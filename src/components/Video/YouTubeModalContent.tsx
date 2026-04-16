'use client';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { YouTubeVideoItem } from '@/src/types';
import { cn, convertSecondsToTime } from '@/src/util/utils';

interface YouTubeModalContentProps {
  videoData: YouTubeVideoItem;
  className?: string;
}

const YouTubeModalContent = ({ videoData, className }: YouTubeModalContentProps) => {
  const { timestamps } = videoData;

  const [isWindow, setIsWindow] = useState<boolean>(false);

  const playerRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  const updateCurrentTime = () => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time ? parseFloat(time.toFixed(3)) : 0);
  };

  const isWithinInterval = (indexInput: number) => {
    if (!timestamps) return false;
    const currentTimeStamp = timestamps[indexInput].seconds;

    if (indexInput === timestamps.length - 1) return currentTimeStamp <= currentTime;

    const nextTimeStamp = timestamps[indexInput + 1].seconds;

    return currentTimeStamp <= currentTime && currentTime < nextTimeStamp;
  };

  useEffect(() => {
    setIsWindow(true);
  }, []);

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
    <>
      <main
        className={cn(
          'relative flex min-w-full flex-col justify-start gap-8 laptop:flex-row',
          className,
        )}
      >
        <div className="relative aspect-video overflow-hidden laptop:max-h-[50vh] laptop:grow">
          {isWindow && (
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${videoData.id}`}
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
          )}
        </div>
        <div className="relative flex flex-col overflow-hidden rounded-lg border-2 border-zinc-400 dark:border-zinc-600 laptop:min-w-80">
          <div className="p-4 dark:bg-zinc-600">
            <h1 className="text-lg font-medium tablet:text-xl">챕터</h1>
          </div>
          <ScrollArea className="flex h-48 flex-col overflow-hidden laptop:h-[43vh] laptop:min-w-80">
            {videoData.timestamps?.map((timestamp, idx) => (
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
                <h1 className="text-base font-medium tablet:text-lg">{timestamp.title}</h1>
                <p className="mt-2 rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base">
                  {convertSecondsToTime(timestamp.seconds)}
                </p>
              </button>
            ))}
          </ScrollArea>
        </div>
      </main>
    </>
  );
};

export default YouTubeModalContent;
