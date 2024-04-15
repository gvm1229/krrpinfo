/* eslint-disable radix */

import React, { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TimeStamp } from '@/src/types';
import { cn, convertSecondsToTime } from '@/src/util/utils';

type EditableTimeStampProps = {
  timestamps: TimeStamp[];
  setTimestamps: (timestamps: TimeStamp[]) => void;
};

const YouTubeTimeStampInput: React.FC<EditableTimeStampProps> = ({ timestamps, setTimestamps }) => {
  const [localTimeStamps, setLocalTimeStamps] = useState<TimeStamp[]>(timestamps);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const handleToggleEdit = (index: number) => {
    setEditMode((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleTitleChange = (index: number, title: string) => {
    const newTimeStamps = [...localTimeStamps];
    newTimeStamps[index].title = title;
    setLocalTimeStamps(newTimeStamps);
  };

  const handleSecondsChange = (index: number, seconds: number) => {
    const newTimeStamps = [...localTimeStamps];
    newTimeStamps[index].seconds = seconds;
    setLocalTimeStamps(newTimeStamps);
  };

  const handleAddTimeStamp = () => {
    setLocalTimeStamps([...localTimeStamps, { title: 'NULL', seconds: 0 }]);
  };

  const handleSave = () => {
    setTimestamps(localTimeStamps);
  };

  return (
    <div className="w-88 laptop:mt-8">
      <ScrollArea className="flex h-48 w-full flex-col overflow-hidden border-4">
        <ul className="flex flex-col gap-4">
          {Object.entries(localTimeStamps).map(([index, timestamp]) => (
            <li key={timestamp.title}>
              {editMode[index] ? (
                <div className="flex w-full flex-col items-start gap-2 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 tablet:p-4">
                  <div className="flex w-full items-center gap-2">
                    <h1 className="text-base font-medium tablet:text-lg">Title:</h1>
                    <input
                      type="text"
                      value={timestamp.title}
                      onChange={(e) => handleTitleChange(parseInt(index), e.target.value)}
                      className="w-full px-1.5 py-0.5 text-base font-medium tablet:text-lg"
                    />
                  </div>
                  <div className="flex w-full items-center gap-2">
                    <h1 className="text-base font-medium tablet:text-lg">Seconds:</h1>
                    <input
                      type="number"
                      value={timestamp.seconds}
                      onChange={(e) => handleSecondsChange(parseInt(index), parseInt(e.target.value))}
                      className="w-full rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base"
                    />
                  </div>
                  <button
                    onClick={() => handleToggleEdit(parseInt(index))}
                    className={cn(buttonVariants(), 'w-full')}
                  >
                    {editMode[index] ? 'Done' : 'Edit'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="flex w-full flex-col items-start gap-2 px-4 py-3 tablet:p-4">
                    <h1 className="text-base font-medium tablet:text-lg">
                      {timestamp.title}
                    </h1>
                    <p className="rounded-md bg-blue-300/35 px-1.5 py-0.5 text-left text-sm font-semibold text-blue-600 dark:bg-blue-500/35 dark:text-blue-500 tablet:text-base">
                      {convertSecondsToTime(timestamp.seconds)}
                    </p>
                  </div>
                  <div className="mr-4 flex gap-x-4">
                    <button
                      onClick={() => handleToggleEdit(parseInt(index))}
                      className={cn(buttonVariants(), '')}
                    >
                      {editMode[index] ? 'Done' : 'Edit'}
                    </button>
                    <button
                      className={cn(buttonVariants(), '')}
                      onClick={() => setLocalTimeStamps(localTimeStamps.filter((_, i) => i !== parseInt(index)))}
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
          onClick={handleAddTimeStamp}
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

export default YouTubeTimeStampInput;
