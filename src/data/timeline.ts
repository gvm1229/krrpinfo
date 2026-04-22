import type { TimelineGroup } from '@/src/types/season';

// 정적 시드. 추후 DB 연동 시 본 함수 시그니처 유지하고 내부만 교체
export async function getTimeline(): Promise<TimelineGroup[]> {
  return [
    {
      id: 'g-s26',
      date: '2024-08-14',
      seasonChip: 'S26',
      dotState: 'active',
      items: [
        {
          id: 'g-s26-i1',
          kicker: 'SEASON LAUNCH',
          title: 'S26 카멜롯 시즌 시작',
          card: {
            variant: 'image',
            imageUrl: '/assets/images/S26/시즌배너.webp',
            alt: 'S26 시즌배너',
          },
          tags: [
            { color: 'blue', text: '신규 시즌' },
            { color: 'gold', text: '대장카트' },
          ],
        },
        {
          id: 'g-s26-i2',
          kicker: 'EVENT',
          title: '트윙클스타 가챠 이벤트',
          card: {
            variant: 'image',
            imageUrl: '/assets/images/S26/대장카_1.webp',
            alt: 'S26 대장카트',
          },
          tags: [
            { color: 'purple', text: '가챠' },
            { color: 'yellow', text: '이벤트' },
          ],
        },
      ],
    },
    {
      id: 'g-s27',
      date: '2024-10-09',
      seasonChip: 'S27',
      dotState: 'upcoming',
      items: [
        {
          id: 'g-s27-i1',
          kicker: 'UPCOMING',
          title: 'S27 신규 시즌 예정',
          card: {
            variant: 'unknown',
          },
          tags: [
            { color: 'sky', text: '한섭' },
            { color: 'green', text: '미공개' },
          ],
        },
        {
          id: 'g-s27-i2',
          kicker: 'EVENT',
          title: '월간패스 37호 출시 예정',
          card: {
            variant: 'unknown',
          },
          tags: [{ color: 'orange', text: '월간패스' }],
        },
      ],
    },
    {
      id: 'g-s25',
      date: '2024-06-12',
      seasonChip: 'S25',
      dotState: 'future',
      items: [
        {
          id: 'g-s25-i1',
          kicker: 'PAST SEASON',
          title: 'S25 아레스 시즌 요약',
          card: {
            variant: 'image',
            imageUrl: '/assets/images/S25/시즌배너.webp',
            alt: 'S25 시즌배너',
          },
          tags: [
            { color: 'purple', text: '종료' },
            { color: 'gold', text: '레전드' },
          ],
        },
      ],
    },
    {
      id: 'g-s28',
      date: '2024-12-04',
      seasonChip: 'S28',
      dotState: 'future',
      items: [
        {
          id: 'g-s28-i1',
          kicker: 'FUTURE',
          title: 'S28 시즌 예고 (중섭 기준)',
          card: {
            variant: 'image',
            imageUrl: '/assets/images/S28/시즌배너.webp',
            alt: 'S28 시즌배너',
          },
          tags: [
            { color: 'red', text: '중섭' },
            { color: 'sky', text: '예고' },
          ],
        },
        {
          id: 'g-s28-i2',
          kicker: 'KART',
          title: '행운의 별자리 아이템카트 출시',
          card: {
            variant: 'unknown',
          },
          tags: [
            { color: 'green', text: '아이템전' },
            { color: 'yellow', text: '별자리' },
          ],
        },
      ],
    },
    {
      id: 'g-s24',
      date: '2024-04-17',
      seasonChip: 'S24',
      dotState: 'future',
      items: [
        {
          id: 'g-s24-i1',
          kicker: 'ARCHIVE',
          title: 'S24 아이오네 시즌 아카이브',
          card: {
            variant: 'image',
            imageUrl: '/assets/images/S24/시즌배너.webp',
            alt: 'S24 시즌배너',
          },
          tags: [
            { color: 'orange', text: '아카이브' },
            { color: 'blue', text: '한섭' },
          ],
        },
      ],
    },
  ];
}
