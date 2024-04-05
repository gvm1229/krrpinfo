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
    channelId: data.snippet.channelId,
    channelTitle: data.snippet.channelTitle,
  };
};

// Main function to generate index.ts file for each channel directory
const generateIndexFile = (source) => {
  const directories = getDirectories(source);
  directories.forEach((dir) => {
    const dirPath = path.join(source, dir);
    const { channelId, channelTitle } = fetchChannelInfo(dirPath);
    const jsonFiles = getJsonFiles(dirPath);
    const videoImports = jsonFiles.map((file) => {
      const videoId = path.basename(file, '.json');
      return `import ${videoId} from './${file}';`;
    });
    const content = `import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
${videoImports.join('\n')}

const channelId = '${channelId}';
const channelTitle = '${channelTitle}';
const allVideos: YouTubeVideoItem[] = [${jsonFiles.map((file) => path.basename(file, '.json')).join(', ')}];

export { channelId, channelTitle, allVideos };
`;
    fs.writeFileSync(path.join(dirPath, 'index.ts'), content);
    console.log(`Generated index.ts file for ${channelTitle} (${dir})`);
  });
};

// Execute the main function
generateIndexFile('./content/youtubers');
