'use client';

import type { Worklog, Freelancer, TimeEntry, DateFilter } from '@/lib/types';
import { calculateWorklogSummary } from '@/lib/data-utils';
import DateRangeFilter from '@/components/DateRangeFilter';

interface WorklogListProps {
  worklogs: Worklog[];
  freelancers: Map<string, Freelancer>;
  timeEntries: Map<string, TimeEntry[]>;
  dateFilter: DateFilter;
  selectedIds: Set<string>;
  excludedIds: Set<string>;
  onDateFilterChange: (filter: DateFilter) => void;
  onWorklogSelect: (id: string) => void;
  onWorklogClick: (id: string) => void;
}

export default function WorklogList({
  worklogs,
  freelancers,
  timeEntries,
  dateFilter,
  selectedIds,
  excludedIds,
  onDateFilterChange,
  onWorklogSelect,
  onWorklogClick,
}: WorklogListProps) {
  const hasFilter = dateFilter.startDate !== null || dateFilter.endDate !== null;

  function handleClear() {
    onDateFilterChange({ startDate: null, endDate: null });
  }

  return (
    <div className="flex flex-col gap-4">
      <DateRangeFilter
        startDate={dateFilter.startDate}
        endDate={dateFilter.endDate}
        onChange={onDateFilterChange}
        onClear={handleClear}
      />

      {worklogs.length === 0 && !hasFilter ? (
        <p className="py-8 text-center text-gray-500">No worklogs available.</p>
      ) : worklogs.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No worklogs found for the selected date range.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Freelancer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Task</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Entries</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total Hours</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {worklogs.map((worklog) => {
                const freelancer = freelancers.get(worklog.freelancerId) ?? {
                  id: worklog.freelancerId,
                  name: 'Unknown Freelancer',
                  hourlyRate: 0,
                };
                const entries = timeEntries.get(worklog.id) ?? [];
                const summary = calculateWorklogSummary(worklog, freelancer, entries);
                const isSelected = selectedIds.has(worklog.id);
                const isExcluded = excludedIds.has(worklog.id);

                return (
                  <tr
                    key={worklog.id}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${isSelected ? 'bg-blue-50' : ''} ${isExcluded ? 'opacity-40' : ''}`}
                    onClick={() => onWorklogClick(worklog.id)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onWorklogSelect(worklog.id)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select worklog ${worklog.taskName}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{freelancer.name}</td>
                    <td className="px-4 py-3 text-gray-900">{worklog.taskName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={worklog.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{summary.entryCount}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {summary.totalHours.toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${summary.totalEarnings.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const STATUS_STYLES: Record<Worklog['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const STATUS_LABELS: Record<Worklog['status'], string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

function StatusBadge({ status }: { status: Worklog['status'] }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
