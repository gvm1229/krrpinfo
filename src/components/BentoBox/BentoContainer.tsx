import { cn } from '@/src/util/utils';

interface BentoContainerProps {
  className?: string;
}
const BentoContainer = ({ className }: BentoContainerProps) => (
  <div className={cn('aspect-square size-full', className)}>
    BentoContainer
  </div>
);

export default BentoContainer;
