'use client';

import { DateFilter } from '@/lib/types';

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (filter: DateFilter) => void;
  onClear: () => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onChange,
  onClear,
}: DateRangeFilterProps) {
  const validationError =
    startDate && endDate && startDate > endDate
      ? 'Start date must be before or equal to end date'
      : null;

  function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ startDate: e.target.value || null, endDate });
  }

  function handleEndChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ startDate, endDate: e.target.value || null });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          From
          <input
            type="date"
            value={startDate ?? ''}
            onChange={handleStartChange}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          To
          <input
            type="date"
            value={endDate ?? ''}
            onChange={handleEndChange}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={onClear}
            className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>
      {validationError && (
        <p className="text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
}
