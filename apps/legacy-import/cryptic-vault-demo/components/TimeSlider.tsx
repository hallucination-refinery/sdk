import React, { ChangeEvent } from 'react';
import { useAppStore } from '@/store';

interface Props {
  dates: string[]; // sorted ascending
}

const TimeSlider: React.FC<Props> = ({ dates }) => {
  const { timeIndex, setTimeIndex, setTimelineDate } = useAppStore();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    setTimeIndex(idx);
    setTimelineDate(dates[idx]);
  };

  const dateLabel = new Date(dates[timeIndex]).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="flex flex-col items-center gap-1 select-none"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150,
      }}
    >
      <span className="mb-1 text-sm text-black/90 backdrop-blur-md bg-white/80 px-2 py-1 rounded shadow">
        {dateLabel}
      </span>
      <input
        type="range"
        min={0}
        max={dates.length - 1}
        step={1}
        value={timeIndex}
        onChange={onChange}
        className="w-64 h-2 bg-gray-800/40 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
      />
    </div>
  );
};

export default TimeSlider;
