/* eslint-disable radix */

'use client';

import React, { useEffect, useState } from 'react';
import { editVideo } from '@/app/actions/handleYTData';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Timestamp, YouTubeVideoItem } from '@/src/types';
import { cn, convertSecondsToTime } from '@/src/util/utils';

type EditableTimestampProps = {
  videoData: YouTubeVideoItem;
};

const YouTubeTimestampInput: React.FC<EditableTimestampProps> = ({ videoData }) => {
  const { timestamps } = videoData;

  const [localTimestamps, setLocalTimestamps] = useState<Timestamp[]>([...timestamps]);
  const [tempTimestamps, setTempTimestamps] = useState<Timestamp[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLocalTimestamps([...timestamps]);
  }, [timestamps]);

  const handleToggleEdit = (index: number, isSave: boolean = false) => {
    setEditMode((prev) => {
      const isEnteringEditMode = !prev[index];
      if (isEnteringEditMode) {
        // Entering edit mode, initialize tempTimestamps with a deep copy of localTimestamps
        const deepCopy = localTimestamps.map((ts) => ({ ...ts }));
        setTempTimestamps(deepCopy);
      } else if (isSave)
        // Exiting edit mode and saving, update localTimestamps with tempTimestamps
        setLocalTimestamps([...tempTimestamps]);

      return { ...prev, [index]: isEnteringEditMode };
    });
  };

  const handleTitleChange = (index: number, title: string) => {
    setTempTimestamps((prev) => prev.map((timestamp, idx) => (idx === index ? { ...timestamp, title } : timestamp)));
  };

  const handleSecondsChange = (index: number, seconds: number) => {
    setTempTimestamps((prev) => prev.map((timestamp, idx) => (idx === index ? { ...timestamp, seconds } : timestamp)));
  };

  const handleAddTimestamp = () => {
    setLocalTimestamps([...localTimestamps, { title: 'NULL', seconds: 0 }]);
  };

  const handleDeleteTimestamp = (index: number) => {
    setLocalTimestamps(localTimestamps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newVideoItem: YouTubeVideoItem = {
      ...videoData,
      timestamps: localTimestamps,
    };

    editVideo(videoData.snippet.channelId, videoData.id, newVideoItem);
  };

  return (
    <div className="w-88 laptop:mt-8">
      <ScrollArea className="flex h-48 w-full flex-col overflow-hidden border-4">
        <ul className="flex flex-col gap-4">
          {localTimestamps.map((timestamp, idx) => (
            <li key={timestamp.title}>
              {editMode[idx] ? (
                <div
                  className="flex w-full flex-col items-start gap-2 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 tablet:p-4"
                >
                  <div className="flex w-full items-center gap-2">
                    <h1 className="text-base font-medium tablet:text-lg">Title:</h1>
                    <input
                      type="text"
                      value={tempTimestamps[idx].title}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      className="w-full px-1.5 py-0.5 text-base font-medium tablet:text-lg"
                    />
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <h1 className="text-base font-medium tablet:text-lg">Seconds:</h1>
                    <input
                      type="number"
                      value={tempTimestamps[idx].seconds}
                      onChange={(e) => handleSecondsChange(idx, parseFloat(e.target.value))}
                      className="w-full rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base"
                    />
                  </div>
                  <div className="mt-2 flex w-full justify-between gap-4">
                    <button
                      onClick={() => handleToggleEdit(idx)}
                      className={cn(buttonVariants(), 'w-full')}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleToggleEdit(idx, true)}
                      className={cn(buttonVariants(), 'w-full')}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="flex w-full flex-col items-start gap-2 px-4 py-3 tablet:p-4">
                    <h1 className="text-base font-medium tablet:text-lg">
                      {timestamp.title}
                    </h1>
                    <p
                      className="rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base"
                    >
                      {convertSecondsToTime(timestamp.seconds)}
                    </p>
                  </div>
                  <div className="mr-4 flex gap-x-4">
                    <button
                      onClick={() => handleToggleEdit(idx)}
                      className={cn(buttonVariants(), '')}
                    >
                      Edit
                    </button>
                    <button
                      className={cn(buttonVariants(), '')}
                      onClick={() => handleDeleteTimestamp(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="mt-4 flex justify-between gap-6">
        <button
          className={cn(buttonVariants(), 'w-full')}
          onClick={handleAddTimestamp}
        >
          + Add Item
        </button>
        <button
          className={cn(buttonVariants(), 'w-full')}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default YouTubeTimestampInput;
