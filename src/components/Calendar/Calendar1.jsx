'use client';

import { useState } from 'react';
import { Calendar } from '@/src/components/ui/calendar';

const Calendar1 = () => {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
};

export default Calendar1;
