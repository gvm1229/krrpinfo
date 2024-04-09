'use client';

import { useState } from 'react';
import type { YouTubeVideoItem } from '@/app/actions/fetchYouTube';
import { getYoutubeData } from '@/app/actions/fetchYouTube';
import {
  appendTimestamps, checkIfChannelExists, checkIfVideoExists, insertOneChannel, insertOneVideo,
} from '@/app/actions/handleYTData';
import InputComponent from '@/components/Data/InputComponent';
import ResponseDisplay from '@/components/Data/ResponseDisplay';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/src/util/utils';

interface ResponseProps {
  success: boolean
  message: string
}

const YouTubeDataInput = () => {
  const [ytUrl, setYtUrl] = useState('');
  const [videoData, setVideoData] = useState<YouTubeVideoItem>(null);
  const [response, setResponse] = useState<ResponseProps>(null);

  const handleFetch = () => {
    try {
      getYoutubeData(ytUrl)
        .then((data) => setVideoData(data));
    } catch (error) {
      setResponse({ success: false, message: error });
    }
  };

  const handleSubmit = () => {
    const channelId = videoData.snippet.channelId;
    const videoId = videoData.id;

    const isExistingChannel = checkIfChannelExists(channelId);

    if (!isExistingChannel) {
      insertOneChannel({
        channelId,
        channelTitle: videoData.snippet.channelTitle,
        allVideos: [videoData],
      });
      setResponse({ success: true, message: `Success, new channel ${videoData.snippet.channelTitle} (${channelId}) created with 1 video` });
      return;
    }

    if (checkIfVideoExists(channelId, videoId)) {
      setResponse({ success: false, message: 'Video already exists' });
      return;
    }

    appendTimestamps(videoData).then((toSubmit) => {
      insertOneVideo(channelId, toSubmit);
      setResponse({ success: true, message: `Success, pushed video to ${videoData.snippet.channelTitle} (${channelId})` });
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
      {/* display stringified json with appropriate indentation format */}
      <pre className="max-h-96 w-full overflow-auto bg-zinc-900 p-4">
        {JSON.stringify(videoData, null, 2)}
      </pre>
      <button
        className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
        onClick={handleSubmit}
      >
        Add to DB
      </button>
      <ResponseDisplay
        response={response}
        className="w-full"
      />
    </div>
  );
};

export default YouTubeDataInput;
