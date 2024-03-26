interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  label?: string;
  items?: NavItem[];
}

export const navContents: NavItem[] = [
  {
    title: '포스트 목록',
    href: '/posts',
  },
  {
    title: '쿠폰 리딤',
    href: '/redeem',
  },
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
