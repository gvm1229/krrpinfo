interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  label?: string;
  items?: NavItem[];
}

export const navContents: NavItem[] = [
  {
    title: 'Posts',
    href: '/posts',
  },
  {
    title: 'Redeem',
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
