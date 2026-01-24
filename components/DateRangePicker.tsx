'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        className={`calendar-day ${isSelected(i) ? 'selected' : isInRange(i) ? 'in-range' : ''
          }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="date-range-container" ref={containerRef}>
      <div className="date-range-input" onClick={() => setIsOpen(!isOpen)}>
        <CalendarIcon size={18} className="icon-left" />
        <span className="calender-placeholder">{displayText()}</span>
        {startDate && <X size={16} className="clear-icon" onClick={clearDates} />}
      </div>

      {isOpen && (
        <div className="calendar-popover animate-in">
          <div className="calendar-header">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
              <ChevronLeft />
            </button>
            <div className="month-title">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
              <ChevronRight />
            </button>
          </div>

          <div className="calendar-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="calendar-grid">{days}</div>
        </div>
      )}

      <style jsx>{`
        .date-range-container {
          position: relative;
          width: 100%;
        }

        .calender-placeholder {
          color: var(--muted-foreground);
          margin-left: 1rem;
          margin-right: 1rem;
        }

        .date-range-input {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.85rem 1rem 0.85rem 1rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--card);
          min-height: 3.25rem;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .date-range-input:hover {
          border-color: var(--primary);
        }

        .icon-left {
          position: absolute;
          left: 1rem;
          color: var(--muted-foreground);
        }

        .clear-icon {
          position: absolute;
          right: 1rem;
          cursor: pointer;
          color: var(--muted-foreground);
        }

        .calendar-popover {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 0;
          width: 360px;
          padding: 1.75rem;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.35);
          z-index: 50;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .calendar-header button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .calendar-header button:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .month-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--primary);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted-foreground);
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .calendar-day {
          height: 40px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: background 0.15s;
        }

        .calendar-day:hover {
          background: rgba(26, 42, 108, 0.08);
        }

        .calendar-day.in-range {
          background: rgba(26, 42, 108, 0.12);
          border-radius: 0;
        }

        .calendar-day.selected {
          background: !important #876;
          color: black !important;
          font-weight: 600 !important;
        }

        .animate-in {
          animation: fadeScale 0.15s ease-out;
        }

        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
