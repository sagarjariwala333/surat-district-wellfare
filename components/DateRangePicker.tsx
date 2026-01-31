'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handleDateClick = (day: number) => {
    const clicked = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const value = formatDate(clicked);

    if (!startDate || (startDate && endDate)) {
      onChange(value, '');
    } else {
      const start = new Date(startDate);
      if (clicked < start) onChange(value, startDate);
      else {
        onChange(startDate, value);
        setIsOpen(false);
      }
    }
  };

  const isSelected = (day: number) => {
    const d = formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    return d === startDate || d === endDate;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const d = formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    return d > startDate && d < endDate;
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '');
    setIsOpen(false);
  };

  const displayText = () => {
    if (!startDate) return 'Select date or range';
    if (!endDate)
      return new Date(startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    return `${new Date(startDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })} – ${new Date(endDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  };

  const days = [];
  const total = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const offset = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < offset; i++) days.push(<div key={`e-${i}`} />);
  for (let i = 1; i <= total; i++) {
    days.push(
      <button
        key={i}
        onClick={() => handleDateClick(i)}
        className={cn(
          "h-10 w-10 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isSelected(i) && "bg-primary text-primary-foreground font-semibold",
          isInRange(i) && "bg-accent text-accent-foreground"
        )}
      >
        {i}
      </button>
    );
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12",
            !startDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText()}
          {startDate && (
            <X 
              className="ml-auto h-4 w-4 hover:text-destructive" 
              onClick={clearDates} 
            />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="w-80 p-6 bg-popover border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95"
          align="start"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold text-primary">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground p-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{days}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
