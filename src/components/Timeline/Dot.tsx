import type { DotState } from '@/src/types/season';

// dot 상태별 Tailwind 클래스 매핑
const stateMap: Record<DotState, string> = {
  active: 'bg-brand-blue ring-2 ring-brand-blue/20',
  upcoming: 'bg-zinc-400',
  future: 'bg-zinc-200 dark:bg-zinc-700',
};

type DotProps = {
  state: DotState;
};

const Dot = ({ state }: DotProps) => (
  <span className={`inline-block size-3 shrink-0 rounded-full ${stateMap[state]}`} />
);

export default Dot;
