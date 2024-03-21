'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/src/util/utils';

interface CalendarProps {
  className?: string;
}

const Calendar1 = ({ className }: CalendarProps) => {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className={cn('rounded-md border', className)}
      showOutsideDays
      fixedWeeks
    />
  );
};

export default Calendar1;
