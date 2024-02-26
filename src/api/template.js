import { config } from 'dotenv';
import { env } from '@/env.mjs';

// Load environment variables from .env file
config();

const API_KEY = env.NEXON_API_KEY;
const characterName = 'Megiii';
const urlString = `https://open.api.nexon.com/kartrush/v1/id?racer_name=${characterName}`;

const answer = fetch(urlString, {
  headers: {
    'x-nxopen-api-key': API_KEY,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

console.log(answer);
