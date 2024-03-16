/* eslint-disable no-useless-catch */
import { config } from 'dotenv';
import { env } from '@/env.mjs';

// Load environment variables from .env file
config();

const API_KEY = env.NEXON_API_KEY;

const fetchData = async (urlString: string) => {
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

interface OuidData {
  ouid_info: {
    ouid: string;
    racer_date_create: string;
    racer_level: string;
  }[];
}

const fetchOuidData = async (characterName: string): Promise<OuidData> => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/id?racer_name=${characterName}`;
  return fetchData(urlString);
};

interface BasicData {
  racer_name: string,
  racer_date_create: string,
  racer_date_last_login: string,
  racer_date_last_logout: string,
  racer_level: number,
}

const fetchBasicData = async (ouid: string): Promise<BasicData> => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/user/basic?ouid=${ouid}`;
  return fetchData(urlString);
};

interface TitleData {
  title_equipment: {
    title_name: string;
  }[];
}

const fetchTitleData = async (ouid: string): Promise<TitleData> => {
  const urlString = `https://open.api.nexon.com/kartrush/v1/user/title-equipment?ouid=${ouid}`;
  return fetchData(urlString);
};

export default fetchOuidData;
export { fetchBasicData, fetchTitleData };
