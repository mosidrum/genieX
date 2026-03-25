'use client';

import type { Worklog, Freelancer, TimeEntry } from '@/lib/types';

interface TimeEntryDetailsProps {
  worklog: Worklog;
  freelancer: Freelancer;
  timeEntries: TimeEntry[];
  onBack: () => void;
}

export default function TimeEntryDetails({
  worklog,
  freelancer,
  timeEntries,
  onBack,
}: TimeEntryDetailsProps) {
  const totalHours = timeEntries.reduce((sum, e) => sum + e.hoursWorked, 0);
  const totalEarnings = totalHours * freelancer.hourlyRate;

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        ← Back to worklogs
      </button>

      {/* Summary header */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{worklog.taskName}</h2>
            <p className="text-sm text-gray-500">{freelancer.name}</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs text-gray-500">Total Hours</p>
              <p className="text-base font-medium text-gray-900">{totalHours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-base font-semibold text-gray-900">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time entries table */}
      {timeEntries.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No time entries for this worklog.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Hours</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Rate ($/hr)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {timeEntries.map((entry) => {
                const earnings = entry.hoursWorked * freelancer.hourlyRate;
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{entry.date}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {entry.hoursWorked.toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ${freelancer.hourlyRate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${earnings.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-gray-200 bg-gray-50">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Total</td>
                <td className="px-4 py-3 text-right font-medium text-gray-700">
                  {totalHours.toFixed(1)}h
                </td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  ${totalEarnings.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
