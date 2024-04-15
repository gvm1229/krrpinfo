import React from 'react';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import YouTubeModalContent from '@/components/Video/YouTubeModalContent';

export default {
  title: 'Components/Video/YouTubeModalContent',
  component: YouTubeModalContent,
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or `padded` by default
  },
};

const Template = (args) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <YouTubeModalContent {...args} />
    </div>
  </ThemeProvider>
);

const video = {
  kind: 'youtube#video',
  etag: 'eDjtrE00haThHgOYjJYN5alUUfo',
  id: 'LXb3EKWsInQ',
  snippet: {
    publishedAt: '2018-06-13T02:49:29Z',
    channelId: 'UCYq-iAOSZBvoUxvfzwKIZWA',
    title: 'COSTA RICA IN 4K 60fps HDR (ULTRA HD)',
    description: 'We\'ve re-mastered and re-uploaded our favorite video in HDR!\n\nCHECK OUT OUR MOST POPULAR VIDEO: https://youtu.be/tO01J-M3g0U\n► INSTAGRAM: http://www.instagram.com/mysterybox\n► INSTAGRAM: http://www.instagram.com/jacobschwarz\n►WEBSITE: http://www.mysterybox.us\n►FACEBOOK: https://www.facebook.com/mysteryboxdi...\n\nMake sure to follow us on Instagram for BTS and sneak-peaks at upcoming projects. \n\nLICENSING & BUSINESS INQUIRIES\n► contact@mysterybox.us\n\nCHECK OUT OUR VIDEO PRODUCTION COMPANY\n► https://www.mysterybox.us\n\n4K PLAYLISTS\n► https://www.youtube.com/playlist?list...\n\nBLOG Check out our blog for great information on working in HDR and 8K. \n► http://www.mysterybox.us/blog\n\nSUBSCRIBE FOR MORE VIDS\n►https://www.youtube.com/user/jacobsch...\n\nMUSIC\n► Storyworks Music "Promise of Dawn"\nhttps://soundcloud.com/joshuapeterson/promise-of-dawn\nwww.storyworksmusic.com\n\n► SHOT ON\nRed Weapon LE w/Helium 8K s35 sensor (Stormtrooper33)\nCanon 16-35mm III  \nCanon 24-70mm II\nSigma 150-500mm\nZeiss Classic 15mm\nMOVI M10\nAdobe Premiere and DaVinci Resolve\n\n\n\nLICENSING & BUSINESS INQUIRIES\n► contact@mysterybox.us\n\nThis video is subject to copyright owned by Mystery Box LLC. Any reproduction or republication of all or part of this video is expressly prohibited, unless Mystery Box has explicitly granted its prior written consent. All other rights reserved.\n\nCopyright © 2017 Mystery Box, LLC. All Rights Reserved.',
    thumbnails: {
      default: {
        url: 'https://i.ytimg.com/vi/LXb3EKWsInQ/default.jpg',
        width: 120,
        height: 90,
      },
      medium: {
        url: 'https://i.ytimg.com/vi/LXb3EKWsInQ/mqdefault.jpg',
        width: 320,
        height: 180,
      },
      high: {
        url: 'https://i.ytimg.com/vi/LXb3EKWsInQ/hqdefault.jpg',
        width: 480,
        height: 360,
      },
      standard: {
        url: 'https://i.ytimg.com/vi/LXb3EKWsInQ/sddefault.jpg',
        width: 640,
        height: 480,
      },
      maxres: {
        url: 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg',
        width: 1280,
        height: 720,
      },
    },
    channelTitle: 'Jacob + Katie Schwarz',
    tags: [
      '4K',
      '4k resolution',
      '60fps',
      'HDR',
      'High Dynamic Range',
      'Costa Rica',
      'four k',
      'UHD',
      'Ultra High Definition',
      'Costa Rica 4k',
      'Jacob + Katie',
      'TV Demo',
      '4k TV',
      'HDR TV',
      'Ultra HD',
      '3840 x 2160',
      '4k videos',
      'ultra HD video',
      'red digital cinema',
    ],
    categoryId: '1',
    liveBroadcastContent: 'none',
    localized: {
      title: 'COSTA RICA IN 4K 60fps HDR (ULTRA HD)',
      description: 'We\'ve re-mastered and re-uploaded our favorite video in HDR!\n\nCHECK OUT OUR MOST POPULAR VIDEO: https://youtu.be/tO01J-M3g0U\n► INSTAGRAM: http://www.instagram.com/mysterybox\n► INSTAGRAM: http://www.instagram.com/jacobschwarz\n►WEBSITE: http://www.mysterybox.us\n►FACEBOOK: https://www.facebook.com/mysteryboxdi...\n\nMake sure to follow us on Instagram for BTS and sneak-peaks at upcoming projects. \n\nLICENSING & BUSINESS INQUIRIES\n► contact@mysterybox.us\n\nCHECK OUT OUR VIDEO PRODUCTION COMPANY\n► https://www.mysterybox.us\n\n4K PLAYLISTS\n► https://www.youtube.com/playlist?list...\n\nBLOG Check out our blog for great information on working in HDR and 8K. \n► http://www.mysterybox.us/blog\n\nSUBSCRIBE FOR MORE VIDS\n►https://www.youtube.com/user/jacobsch...\n\nMUSIC\n► Storyworks Music "Promise of Dawn"\nhttps://soundcloud.com/joshuapeterson/promise-of-dawn\nwww.storyworksmusic.com\n\n► SHOT ON\nRed Weapon LE w/Helium 8K s35 sensor (Stormtrooper33)\nCanon 16-35mm III  \nCanon 24-70mm II\nSigma 150-500mm\nZeiss Classic 15mm\nMOVI M10\nAdobe Premiere and DaVinci Resolve\n\n\n\nLICENSING & BUSINESS INQUIRIES\n► contact@mysterybox.us\n\nThis video is subject to copyright owned by Mystery Box LLC. Any reproduction or republication of all or part of this video is expressly prohibited, unless Mystery Box has explicitly granted its prior written consent. All other rights reserved.\n\nCopyright © 2017 Mystery Box, LLC. All Rights Reserved.',
    },
    defaultAudioLanguage: 'en',
  },
  timestamps: [
    {
      title: 'Start',
      seconds: 0,
    },
    {
      title: 'Snake',
      seconds: 6.847,
    },
    {
      title: 'Sloth',
      seconds: 12.764,
    },
    {
      title: 'Ants',
      seconds: 27.311,
    },
    {
      title: 'Frog',
      seconds: 34,
    },
    {
      title: 'Snake 2',
      seconds: 42.532,
    },
    {
      title: 'Turtle',
      seconds: 56.452,
    },
    {
      title: 'Lizard',
      seconds: 61.934,
    },
    {
      title: 'Snake 3',
      seconds: 72.353,
    },
    {
      title: 'Frog 2',
      seconds: 81.904,
    },
    {
      title: 'Parrot',
      seconds: 90.273,
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  videoData: video,
  className: 'max-h-[50vh] h-full',
};
