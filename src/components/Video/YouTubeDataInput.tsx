'use client';

import { useState } from 'react';
import { getYoutubeData } from '@/app/actions/fetchYouTube';
import {
  appendTimestamps, checkIfChannelExists, checkIfVideoExists, insertOneChannel, insertOneVideo,
} from '@/app/actions/handleYTData';
import InputComponent from '@/components/Data/InputComponent';
import ResponseDisplay from '@/components/Data/ResponseDisplay';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { YouTubeVideoItem } from '@/src/types';
import { capitalizeFirstLetter, cn } from '@/src/util/utils';

// Extract the type of the category property from YouTubeVideoItem
type VideoCategory = YouTubeVideoItem['category'];

const CategorySelect = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: VideoCategory
  setSelectedCategory: (value: VideoCategory) => void
}) => {
  // Use VideoCategory in an array context
  const categories: VideoCategory[] = ['current season', 'upcoming season', 'last season', 'tips'];

  return (
    <Select
      value={selectedCategory}
      onValueChange={setSelectedCategory}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select video category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {categories.map((value) => (
            <SelectItem key={value} value={value}>{capitalizeFirstLetter(value)}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

interface ResponseProps {
  success: boolean
  message: string
}

const YouTubeDataInput = () => {
  const [ytUrl, setYtUrl] = useState('');
  const [videoData, setVideoData] = useState<YouTubeVideoItem>(null);
  const [response, setResponse] = useState<ResponseProps>(null);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('current season');

  const handleFetch = () => {
    try {
      getYoutubeData(ytUrl)
        .then((data) => setVideoData(data));
    } catch (error) {
      setResponse({ success: false, message: error });
    }
  };

  const handleSubmit = async () => {
    const channelId = videoData.snippet.channelId;
    const videoId = videoData.id;

    checkIfChannelExists(channelId).then((isExistingChannel) => {
      if (!isExistingChannel) {
        appendTimestamps(videoData).then((dataToInsert) => {
          insertOneChannel({
            channelId,
            channelTitle: videoData.snippet.channelTitle,
            allVideos: [dataToInsert],
          });
          setResponse({ success: true, message: `Success, new channel ${videoData.snippet.channelTitle} (${channelId}) created with 1 video` });
        });
        return;
      }

      checkIfVideoExists(channelId, videoId).then((isExistingVideo) => {
        if (isExistingVideo) {
          setResponse({ success: false, message: 'Video already exists' });
          return;
        }

        appendTimestamps(videoData).then((dataToInsert) => {
          insertOneVideo(channelId, { ...dataToInsert, category: selectedCategory });
          setResponse({ success: true, message: `Success, pushed video to ${videoData.snippet.channelTitle} (${channelId})` });
        });
      });
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <InputComponent
        label="YouTube Video URL Input"
        value={ytUrl}
        onChange={setYtUrl}
      />
      <button
        className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
        onClick={handleFetch}
      >
        Fetch Video Data
      </button>
      <button
        className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
        onClick={() => checkIfVideoExists(videoData.snippet.channelId, videoData.id).then((result) => {
          if (result) setResponse({ success: false, message: `In channel ${videoData.snippet.channelTitle}, Video already exists` });
          else setResponse({ success: true, message: `In channel ${videoData.snippet.channelTitle}, Video does not exist` });
        })}
      >
        Check exist
      </button>
      {/* display stringified json with appropriate indentation format */}
      <pre className="max-h-96 w-full overflow-auto bg-zinc-900 p-4">
        {JSON.stringify(videoData, null, 2)}
      </pre>
      <CategorySelect
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <button
        className={cn(
          buttonVariants({ variant: 'secondary' }),
          'w-full',
          (!response?.success || videoData == null) && 'cursor-not-allowed',
        )}
        onClick={handleSubmit}
        disabled={!(response?.success && videoData !== null)}
      >
        Add to DB
      </button>
      <ResponseDisplay
        response={response}
      />
    </div>
  );
};

export default YouTubeDataInput;
