'use client';

import { useState } from 'react';
import { getYoutubeData } from '@/app/actions/fetchYouTube';
import InputComponent from '@/components/Nexon/InputComponent';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/src/util/utils';

const YouTubeDataInput = () => {
  const [ytUrl, setYtUrl] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = () => {
    getYoutubeData(ytUrl)
      .then((data) => setResponse(data));
  };

  return (
    <>
      <InputComponent
        label="YT URL"
        value={ytUrl}
        onChange={setYtUrl}
      />
      <button
        className={cn(buttonVariants(), '')}
        onClick={handleSubmit}
      >
        Submit
      </button>
      {/* display stringified json with appropriate indentation format */}
      <pre className="w-full">
        {JSON.stringify(response, null, 2)}
      </pre>
    </>
  );
};

export default YouTubeDataInput;
