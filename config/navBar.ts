interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  label?: string;
  items?: NavItem[];
}

// youtubers page feature flag gate
const showYoutubers = process.env.NEXT_PUBLIC_SHOW_YOUTUBERS === 'true';

export const navContents: NavItem[] = [
  {
    title: '포스트 목록',
    href: '/posts',
  },
  {
    title: '쿠폰 리딤',
    href: '/redeem',
  },
  {
    title: '시즌 미래시',
    href: '/seasons',
  },
  ...(showYoutubers
    ? [
        {
          title: '추천 유튜버 목록',
          href: '/youtubers',
          label: 'New',
          items: [
            {
              title: '영상 별로 모아보기',
              href: '/youtubers/videos',
              label: 'New',
            },
          ],
        },
      ]
    : []),
  // {
  //   title: 'Karts',
  //   href: '/karts',
  //   items: [
  //     {
  //       title: 'Legendary Karts',
  //       href: '/karts/legendary',
  //       label: 'New',
  //     },
  //     {
  //       title: 'Rare Karts',
  //       href: '/karts/rare',
  //     },
  //   ],
  // },
  // {
  //   title: 'Riders',
  //   href: '/riders',
  // },
  // {
  //   title: 'Guides',
  //   href: '/guides',
  // },
];
