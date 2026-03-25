'use client';

import type { Worklog, Freelancer, TimeEntry } from '@/lib/types';
import { buildPaymentBatch } from '@/lib/data-utils';

interface PaymentBatchReviewProps {
  selectedWorklogs: Worklog[];
  freelancers: Map<string, Freelancer>;
  timeEntries: Map<string, TimeEntry[]>;
  excludedWorklogIds: Set<string>;
  excludedFreelancerIds: Set<string>;
  onExcludeWorklog: (id: string) => void;
  onExcludeFreelancer: (id: string) => void;
  onIncludeWorklog: (id: string) => void;
  onIncludeFreelancer: (id: string) => void;
  onConfirm: () => void;
}

export default function PaymentBatchReview({
  selectedWorklogs,
  freelancers,
  timeEntries,
  excludedWorklogIds,
  excludedFreelancerIds,
  onExcludeWorklog,
  onExcludeFreelancer,
  onIncludeWorklog,
  onIncludeFreelancer,
  onConfirm,
}: PaymentBatchReviewProps) {
  const batch = buildPaymentBatch(
    selectedWorklogs,
    freelancers,
    timeEntries,
    excludedWorklogIds,
    excludedFreelancerIds
  );

  // Group worklogs by freelancer for display
  const freelancerGroups = new Map<string, typeof batch.worklogs>();
  for (const summary of batch.worklogs) {
    const fid = summary.freelancer.id;
    if (!freelancerGroups.has(fid)) freelancerGroups.set(fid, []);
    freelancerGroups.get(fid)!.push(summary);
  }

  // Also collect excluded worklogs for display
  const excludedSummaries = selectedWorklogs
    .filter((w) => excludedWorklogIds.has(w.id) || excludedFreelancerIds.has(w.freelancerId))
    .map((worklog) => {
      const freelancer = freelancers.get(worklog.freelancerId) ?? {
        id: worklog.freelancerId,
        name: 'Unknown Freelancer',
        hourlyRate: 0,
      };
      const entries = timeEntries.get(worklog.id) ?? [];
      const totalHours = entries.reduce((s, e) => s + e.hoursWorked, 0);
      return {
        worklog,
        freelancer,
        totalHours,
        totalEarnings: totalHours * freelancer.hourlyRate,
        entryCount: entries.length,
      };
    });

  // Group excluded by freelancer
  const excludedByFreelancer = new Map<string, typeof excludedSummaries>();
  for (const s of excludedSummaries) {
    const fid = s.freelancer.id;
    if (!excludedByFreelancer.has(fid)) excludedByFreelancer.set(fid, []);
    excludedByFreelancer.get(fid)!.push(s);
  }

  const allFreelancerIds = new Set([
    ...Array.from(freelancerGroups.keys()),
    ...Array.from(excludedByFreelancer.keys()),
  ]);

  const hasIncluded = batch.worklogCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary panel */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Batch Summary</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard label="Total Amount" value={`$${batch.totalAmount.toFixed(2)}`} highlight />
          <SummaryCard label="Freelancers" value={String(batch.freelancerCount)} />
          <SummaryCard label="Worklogs" value={String(batch.worklogCount)} />
          <SummaryCard label="Time Entries" value={String(batch.entryCount)} />
        </div>
      </div>

      {/* Worklogs grouped by freelancer */}
      <div className="flex flex-col gap-4">
        {Array.from(allFreelancerIds).map((freelancerId) => {
          const included = freelancerGroups.get(freelancerId) ?? [];
          const excluded = excludedByFreelancer.get(freelancerId) ?? [];
          const allSummaries = [...included, ...excluded];
          const freelancer = allSummaries[0]?.freelancer ?? {
            id: freelancerId,
            name: 'Unknown Freelancer',
            hourlyRate: 0,
          };
          const isFreelancerExcluded = excludedFreelancerIds.has(freelancerId);

          return (
            <div
              key={freelancerId}
              className={`rounded-lg border bg-white ${isFreelancerExcluded ? 'border-red-200 opacity-60' : 'border-gray-200'}`}
            >
              {/* Freelancer header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${isFreelancerExcluded ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                  >
                    {freelancer.name}
                  </span>
                  <span className="text-xs text-gray-400">${freelancer.hourlyRate}/hr</span>
                  {isFreelancerExcluded && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      Excluded
                    </span>
                  )}
                </div>
                {isFreelancerExcluded ? (
                  <button
                    onClick={() => onIncludeFreelancer(freelancerId)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Re-include freelancer
                  </button>
                ) : (
                  <button
                    onClick={() => onExcludeFreelancer(freelancerId)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Exclude all
                  </button>
                )}
              </div>

              {/* Worklog rows */}
              <ul className="divide-y divide-gray-50">
                {allSummaries.map(({ worklog, totalHours, totalEarnings, entryCount }) => {
                  const isWorklogExcluded =
                    isFreelancerExcluded || excludedWorklogIds.has(worklog.id);

                  return (
                    <li
                      key={worklog.id}
                      className={`flex items-center justify-between px-4 py-3 ${isWorklogExcluded ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${isWorklogExcluded ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                        >
                          {worklog.taskName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {entryCount} {entryCount === 1 ? 'entry' : 'entries'} ·{' '}
                          {totalHours.toFixed(1)}h
                        </span>
                        {excludedWorklogIds.has(worklog.id) && !isFreelancerExcluded && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            Excluded
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium ${isWorklogExcluded ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          ${totalEarnings.toFixed(2)}
                        </span>
                        {!isFreelancerExcluded &&
                          (excludedWorklogIds.has(worklog.id) ? (
                            <button
                              onClick={() => onIncludeWorklog(worklog.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Re-include
                            </button>
                          ) : (
                            <button
                              onClick={() => onExcludeWorklog(worklog.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Exclude
                            </button>
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Confirm button */}
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          disabled={!hasIncluded}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm Payment — ${batch.totalAmount.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
