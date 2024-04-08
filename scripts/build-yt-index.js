// noinspection JSLastCommaInObjectLiteral
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

// Function to scan the directory for folders
const getDirectories = (source) => fs.readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Function to get the JSON files in a directory
const getJsonFiles = (source) => fs.readdirSync(source)
  .filter((file) => path.extname(file) === '.json');

// Function to fetch channelId and channelTitle from a JSON file
const fetchChannelInfo = (source) => {
  const files = getJsonFiles(source);
  if (files.length === 0)
    throw new Error(`No JSON files found in directory: ${source}`);

  const firstFile = path.join(source, files[0]);
  const data = JSON.parse(fs.readFileSync(firstFile, 'utf-8'));
  return {
    channelId: data.snippet.channelId.replace(/-/g, '_'), // Replace hyphens with underscores
    channelTitle: data.snippet.channelTitle,
  };
};

// Main function to generate index.ts file for each channel directory
const generateIndexFile = (source) => {
  const directories = getDirectories(source);
  const allChannels = {};

  directories.forEach((dir) => {
    const dirPath = path.join(source, dir);
    const { channelId, channelTitle } = fetchChannelInfo(dirPath);
    const jsonFiles = getJsonFiles(dirPath);
    const allVideos = jsonFiles.map((file) => path.basename(file, '.json'));

    const content = `import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
${jsonFiles.map((file) => `import ${path.basename(file, '.json')} from './${file}';`).join('\n')}

const channelId = '${channelId}';
const channelTitle = '${channelTitle}';
const allVideos: YouTubeVideoItem[] = [${allVideos.join(', ')}];

export {
  channelId as channelId_${channelId},
  channelTitle as channelTitle_${channelId},
  allVideos as allVideos_${channelId},
};
`;

    fs.writeFileSync(path.join(dirPath, 'index.ts'), content);
    console.log(`Generated index.ts file for ${channelTitle} (${dir})`);

    allChannels[channelId] = {
      channelId: `channelId_${channelId}`,
      channelTitle: `channelTitle_${channelId}`,
      allVideos: `allVideos_${channelId}`,
    };
  });

  // Create index.ts file in the youtubers directory
  const allChannelsContent = `import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
${Object.keys(allChannels).map((channelId) => `import {
  channelId_${channelId},
  channelTitle_${channelId},
  allVideos_${channelId},
} from './${channelId}';`).join('\n')}

export type YouTubeChannel = {
  channelId: string;
  channelTitle: string;
  allVideos: YouTubeVideoItem[];
};

export const allYoutubers: Record<string, YouTubeChannel> = {
${Object.keys(allChannels).map((channelId) => `  ${channelId}: {
    channelId: channelId_${channelId},
    channelTitle: channelTitle_${channelId},
    allVideos: allVideos_${channelId},
  },`).join('\n')}
};
`;

  fs.writeFileSync(path.join(source, 'index.ts'), allChannelsContent);
  console.log('Generated index.ts file for all channels');
};

// Execute the main function
generateIndexFile('./content/youtubers');
