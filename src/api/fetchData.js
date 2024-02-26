/* eslint-disable no-useless-catch */
import { config } from 'dotenv';
import { env } from '@/env.mjs';

// Load environment variables from .env file
config();

const API_KEY = env.NEXON_API_KEY;

const fetchData = async (urlString) => {
  try {
    if (!urlString) throw new Error('urlString cannot be empty');

    const response = await fetch(urlString, {
      headers: {
        'x-nxopen-api-key': API_KEY,
      },
    });

    if (!response.ok) throw new Error('Network response was not ok');

    return await response.json();
  } catch (error) {
    // Do not log the error here, let the calling code handle it
    throw error;
  }
};

const fetchOuidData = async (characterName) => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/id?racer_name=${characterName}`;
  return fetchData(urlString);
};

const fetchBasicData = async (ouid) => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/user/basic?ouid=${ouid}`;
  return fetchData(urlString);
};

const fetchTitleData = async (ouid) => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/user/title-equipment?ouid=${ouid}`;
  return fetchData(urlString);
};

export default fetchOuidData;
export { fetchBasicData, fetchTitleData };
