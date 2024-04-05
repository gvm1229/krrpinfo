// noinspection JSLastCommaInObjectLiteral
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Load environment variables from .env file
const ytApiKey = process.env.YOUTUBE_API_KEY;

function filteredUrlId(allUrl) {
  if (allUrl.indexOf('/watch') > -1) {
    const arr = allUrl.replaceAll(/=|&/g, '?').split('?');
    return arr[arr.indexOf('v') + 1];
  }
  if (allUrl.indexOf('/youtu.be') > -1) {
    const arr = allUrl.replaceAll(/=|&|\//g, '?').split('?');
    return arr[arr.indexOf('youtu.be') + 1];
  }

  return null;
}

async function getYoutubeData(url) {
  try {
    const id = filteredUrlId(url);

    // move to the error branch if id is null
    if (!id) throw new Error('id is null');

    const resURL = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${ytApiKey}&part=snippet`;

    console.log(`Fetching: ${resURL}\n`);

    const res = await fetch(resURL);

    // receive res as object
    const data = await res.json();

    return data.items[0]?.snippet;
  } catch (err) {
    throw new Error(`Error fetching YT Data: ${err}\n`);
  }
}

// Function to create directory if it doesn't exist
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory))
    fs.mkdirSync(directory, { recursive: true });
};

// Function to fetch YouTube snippet data and save as JSON file
const fetchAndSaveSnippetData = async (videoUrl) => {
  try {
    const snippet = await getYoutubeData(videoUrl);

    if (!snippet) {
      console.log(`No snippet data found for ${videoUrl}.`);
      return;
    }

    const videoId = snippet.id;
    const channelId = snippet.channelId;

    const channelDirectory = path.join('./content/youtubers', channelId);
    createDirectoryIfNotExists(channelDirectory);

    const jsonFilePath = path.join(channelDirectory, `${videoId}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(snippet, null, 2));

    console.log(`Snippet data for video ${videoId} saved successfully.\n`);
  } catch (error) {
    console.error(`Error fetching and saving snippet data for ${videoUrl}: ${error.message}`);
  }
};

// Main function to handle command line arguments
const main = () => {
  const args = process.argv.slice(2); // Exclude 'node' and script filename from arguments
  if (args.length === 0) {
    console.log('Usage: node fetch-yt-index.js {youtube link (can be multiple)}');
    return;
  }

  args.forEach(fetchAndSaveSnippetData);
};

// Execute the main function
main();
