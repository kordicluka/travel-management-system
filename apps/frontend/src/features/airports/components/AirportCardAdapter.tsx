import type { Airport } from '@/types';
import { AirportCard } from './AirportCard';

interface AirportCardAdapterProps {
  item: Airport;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Adapter to make AirportCard compatible with ListContent generic interface
 */
export function AirportCardAdapter({
  item,
  onDelete,
  isSelected,
}: AirportCardAdapterProps) {
  return (
    <AirportCard
      airport={item}
      onDelete={onDelete || (() => {})}
      isSelected={isSelected}
    />
  );
}
