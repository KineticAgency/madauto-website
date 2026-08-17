"use client";

import { useState } from "react";

const MONTHS = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];

const DAY_LABELS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function isSunday(d: Date) {
  return d.getDay() === 0;
}

type Props = {
  selectedDate: string | null;
  onSelect: (dateKey: string) => void;
  today: Date;
};

export default function BookingCalendar({ selectedDate, onSelect, today }: Props) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayKey = toDateKey(today);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  const goPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    if (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth()) return;
    if (prev.getFullYear() < today.getFullYear()) return;
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const goNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Prethodni mesec"
          className="rounded-md px-2 py-1 text-primary-600 hover:bg-primary-50"
        >
          ←
        </button>
        <p className="font-semibold text-primary-900">
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Sledeći mesec"
          className="rounded-md px-2 py-1 text-primary-600 hover:bg-primary-50"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        {DAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <span key={`empty-${idx}`} />;

          const key = toDateKey(date);
          const disabled = isSunday(date) || key < todayKey || date > maxDate;
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;

          return (
            <button
              type="button"
              key={key}
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={`aspect-square rounded-md text-sm transition-colors ${
                isSelected
                  ? "bg-accent-500 font-semibold text-white"
                  : disabled
                  ? "cursor-not-allowed text-gray-300"
                  : "text-primary-800 hover:bg-primary-50"
              } ${isToday && !isSelected ? "ring-1 ring-primary-300" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-500">Nedeljom ne radimo. Termini do 60 dana unapred.</p>
    </div>
  );
}
