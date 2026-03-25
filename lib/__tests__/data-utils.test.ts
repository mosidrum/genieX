import { describe, it, expect } from 'vitest';
import { calculateWorklogSummary, filterWorklogsByDateRange } from '../data-utils';
import type { Worklog, Freelancer, TimeEntry, DateFilter } from '../types';

const worklog: Worklog = {
  id: 'work-650e8400-e29b-41d4-a716-446655440001',
  taskName: 'Frontend Development',
  freelancerId: '550e8400-e29b-41d4-a716-446655440001',
  status: 'completed',
};

const freelancer: Freelancer = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Alice Johnson',
  hourlyRate: 75,
};

function makeEntry(id: string, hoursWorked: number): TimeEntry {
  return {
    id,
    worklogId: worklog.id,
    date: '2024-01-15',
    hoursWorked,
  };
}

describe('calculateWorklogSummary', () => {
  it('calculates total earnings correctly for a single time entry', () => {
    const entries = [makeEntry('e1', 8)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.totalEarnings).toBe(600); // 8 * 75
  });

  it('calculates total earnings correctly for multiple time entries', () => {
    const entries = [makeEntry('e1', 4), makeEntry('e2', 6), makeEntry('e3', 2)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.totalEarnings).toBe(900); // 12 * 75
  });

  it('calculates total hours as sum of all entry hours', () => {
    const entries = [makeEntry('e1', 3), makeEntry('e2', 5)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.totalHours).toBe(8);
  });

  it('returns correct entry count', () => {
    const entries = [makeEntry('e1', 2), makeEntry('e2', 3), makeEntry('e3', 1)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.entryCount).toBe(3);
  });

  it('returns zero earnings when hours worked is zero', () => {
    const entries = [makeEntry('e1', 0)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.totalEarnings).toBe(0);
    expect(summary.totalHours).toBe(0);
  });

  it('returns zero earnings when hourly rate is zero', () => {
    const zeroRateFreelancer: Freelancer = { ...freelancer, hourlyRate: 0 };
    const entries = [makeEntry('e1', 8)];
    const summary = calculateWorklogSummary(worklog, zeroRateFreelancer, entries);
    expect(summary.totalEarnings).toBe(0);
  });

  it('returns zero totals when time entries array is empty', () => {
    const summary = calculateWorklogSummary(worklog, freelancer, []);
    expect(summary.totalHours).toBe(0);
    expect(summary.totalEarnings).toBe(0);
    expect(summary.entryCount).toBe(0);
  });

  it('returns zero earnings when both hours and rate are zero', () => {
    const zeroRateFreelancer: Freelancer = { ...freelancer, hourlyRate: 0 };
    const entries = [makeEntry('e1', 0)];
    const summary = calculateWorklogSummary(worklog, zeroRateFreelancer, entries);
    expect(summary.totalEarnings).toBe(0);
  });

  it('includes the original worklog and freelancer in the summary', () => {
    const summary = calculateWorklogSummary(worklog, freelancer, []);
    expect(summary.worklog).toBe(worklog);
    expect(summary.freelancer).toBe(freelancer);
  });

  it('handles fractional hours correctly', () => {
    const entries = [makeEntry('e1', 1.5), makeEntry('e2', 2.5)];
    const summary = calculateWorklogSummary(worklog, freelancer, entries);
    expect(summary.totalHours).toBeCloseTo(4);
    expect(summary.totalEarnings).toBeCloseTo(300); // 4 * 75
  });

  it('calculates correctly with a high hourly rate', () => {
    const highRateFreelancer: Freelancer = { ...freelancer, hourlyRate: 500 };
    const entries = [makeEntry('e1', 10)];
    const summary = calculateWorklogSummary(worklog, highRateFreelancer, entries);
    expect(summary.totalEarnings).toBe(5000);
  });
});

const wl1: Worklog = { id: 'wl-1', taskName: 'Task A', freelancerId: 'f-1', status: 'completed' };
const wl2: Worklog = { id: 'wl-2', taskName: 'Task B', freelancerId: 'f-2', status: 'in_progress' };
const wl3: Worklog = { id: 'wl-3', taskName: 'Task C', freelancerId: 'f-3', status: 'pending' };

function makeTimeEntriesMap(entries: Record<string, TimeEntry[]>): Map<string, TimeEntry[]> {
  return new Map(Object.entries(entries));
}

describe('filterWorklogsByDateRange', () => {
  it('returns all worklogs when both startDate and endDate are null', () => {
    const entriesMap = makeTimeEntriesMap({
      'wl-1': [{ id: 'e1', worklogId: 'wl-1', date: '2024-01-10', hoursWorked: 4 }],
      'wl-2': [{ id: 'e2', worklogId: 'wl-2', date: '2024-03-20', hoursWorked: 6 }],
    });
    const filter: DateFilter = { startDate: null, endDate: null };
    const result = filterWorklogsByDateRange([wl1, wl2], entriesMap, filter);
    expect(result).toEqual([wl1, wl2]);
  });

  it('returns only worklogs with at least one entry within the date range', () => {
    const entriesMap = makeTimeEntriesMap({
      'wl-1': [{ id: 'e1', worklogId: 'wl-1', date: '2024-01-15', hoursWorked: 4 }],
      'wl-2': [{ id: 'e2', worklogId: 'wl-2', date: '2024-03-01', hoursWorked: 6 }],
      'wl-3': [{ id: 'e3', worklogId: 'wl-3', date: '2024-01-20', hoursWorked: 2 }],
    });
    const filter: DateFilter = { startDate: '2024-01-01', endDate: '2024-01-31' };
    const result = filterWorklogsByDateRange([wl1, wl2, wl3], entriesMap, filter);
    expect(result).toEqual([wl1, wl3]);
  });

  it('includes a worklog if any one of its entries falls within the range', () => {
    const entriesMap = makeTimeEntriesMap({
      'wl-1': [
        { id: 'e1', worklogId: 'wl-1', date: '2024-01-05', hoursWorked: 3 }, // outside
        { id: 'e2', worklogId: 'wl-1', date: '2024-01-15', hoursWorked: 5 }, // inside
      ],
    });
    const filter: DateFilter = { startDate: '2024-01-10', endDate: '2024-01-20' };
    const result = filterWorklogsByDateRange([wl1], entriesMap, filter);
    expect(result).toEqual([wl1]);
  });

  it('returns an empty array when no worklogs have entries in the date range', () => {
    const entriesMap = makeTimeEntriesMap({
      'wl-1': [{ id: 'e1', worklogId: 'wl-1', date: '2024-06-01', hoursWorked: 4 }],
      'wl-2': [{ id: 'e2', worklogId: 'wl-2', date: '2024-07-15', hoursWorked: 6 }],
    });
    const filter: DateFilter = { startDate: '2024-01-01', endDate: '2024-01-31' };
    const result = filterWorklogsByDateRange([wl1, wl2], entriesMap, filter);
    expect(result).toEqual([]);
  });

  it('includes entries on the start and end boundary dates (inclusive)', () => {
    const entriesMap = makeTimeEntriesMap({
      'wl-1': [{ id: 'e1', worklogId: 'wl-1', date: '2024-01-01', hoursWorked: 4 }],
      'wl-2': [{ id: 'e2', worklogId: 'wl-2', date: '2024-01-31', hoursWorked: 4 }],
    });
    const filter: DateFilter = { startDate: '2024-01-01', endDate: '2024-01-31' };
    const result = filterWorklogsByDateRange([wl1, wl2], entriesMap, filter);
    expect(result).toEqual([wl1, wl2]);
  });

  it('returns empty array when worklogs have no time entries', () => {
    const entriesMap = makeTimeEntriesMap({});
    const filter: DateFilter = { startDate: '2024-01-01', endDate: '2024-12-31' };
    const result = filterWorklogsByDateRange([wl1, wl2], entriesMap, filter);
    expect(result).toEqual([]);
  });
});

// Helpers for buildPaymentBatch tests
function makeWorklog(id: string, freelancerId: string): Worklog {
  return { id, taskName: `Task ${id}`, freelancerId, status: 'completed' };
}

function makeFreelancer(id: string, hourlyRate: number): Freelancer {
  return { id, name: `Freelancer ${id}`, hourlyRate };
}

function makeEntries(worklogId: string, hours: number[]): TimeEntry[] {
  return hours.map((h, i) => ({
    id: `${worklogId}-e${i}`,
    worklogId,
    date: '2024-01-15',
    hoursWorked: h,
  }));
}

import { buildPaymentBatch } from '../data-utils';

describe('buildPaymentBatch', () => {
  const f1 = makeFreelancer('f-1', 100);
  const f2 = makeFreelancer('f-2', 50);
  const f3 = makeFreelancer('f-3', 80);

  const wl1 = makeWorklog('wl-1', 'f-1'); // f1: 3+5 = 8h => $800
  const wl2 = makeWorklog('wl-2', 'f-1'); // f1: 2h => $200
  const wl3 = makeWorklog('wl-3', 'f-2'); // f2: 4h => $200
  const wl4 = makeWorklog('wl-4', 'f-3'); // f3: 6h => $480

  const freelancersMap = new Map([
    ['f-1', f1],
    ['f-2', f2],
    ['f-3', f3],
  ]);

  const timeEntriesMap = new Map([
    ['wl-1', makeEntries('wl-1', [3, 5])],
    ['wl-2', makeEntries('wl-2', [2])],
    ['wl-3', makeEntries('wl-3', [4])],
    ['wl-4', makeEntries('wl-4', [6])],
  ]);

  it('calculates total amount with no exclusions', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set()
    );
    // f1: (8+2)*100=1000, f2: 4*50=200, f3: 6*80=480 => 1680
    expect(batch.totalAmount).toBe(1680);
  });

  it('excludes excluded worklog ids from total calculation', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(['wl-2']), // exclude wl-2 ($200)
      new Set()
    );
    // f1: 8*100=800, f2: 4*50=200, f3: 6*80=480 => 1480
    expect(batch.totalAmount).toBe(1480);
  });

  it('excludes all worklogs for an excluded freelancer from total calculation', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set(['f-1']) // exclude f1 who has wl-1 and wl-2
    );
    // f2: 4*50=200, f3: 6*80=480 => 680
    expect(batch.totalAmount).toBe(680);
  });

  it('excludes both worklog-level and freelancer-level exclusions from total', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(['wl-3']), // exclude wl-3
      new Set(['f-1']) // exclude f-1 (wl-1, wl-2)
    );
    // only wl-4 remains: 6*80=480
    expect(batch.totalAmount).toBe(480);
  });

  it('counts only unique freelancers among included worklogs', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set()
    );
    // f-1 appears in wl-1 and wl-2, but should be counted once
    expect(batch.freelancerCount).toBe(3);
  });

  it('unique freelancer count decreases when a freelancer is excluded', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set(['f-1'])
    );
    expect(batch.freelancerCount).toBe(2);
  });

  it('unique freelancer count is correct when multiple worklogs share the same freelancer', () => {
    // All worklogs belong to f-1
    const allF1 = [makeWorklog('x-1', 'f-1'), makeWorklog('x-2', 'f-1'), makeWorklog('x-3', 'f-1')];
    const entries = new Map([
      ['x-1', makeEntries('x-1', [1])],
      ['x-2', makeEntries('x-2', [2])],
      ['x-3', makeEntries('x-3', [3])],
    ]);
    const batch = buildPaymentBatch(allF1, freelancersMap, entries, new Set(), new Set());
    expect(batch.freelancerCount).toBe(1);
  });

  it('reports correct worklog count with exclusions applied', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(['wl-1']),
      new Set(['f-3'])
    );
    // wl-2 (f-1) and wl-3 (f-2) remain
    expect(batch.worklogCount).toBe(2);
  });

  it('reports correct entry count across all included worklogs', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set()
    );
    // wl-1: 2 entries, wl-2: 1, wl-3: 1, wl-4: 1 => 5
    expect(batch.entryCount).toBe(5);
  });

  it('entry count excludes entries from excluded worklogs', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(['wl-1']), // wl-1 has 2 entries
      new Set()
    );
    // wl-2: 1, wl-3: 1, wl-4: 1 => 3
    expect(batch.entryCount).toBe(3);
  });

  it('returns empty batch when all freelancers are excluded', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(),
      new Set(['f-1', 'f-2', 'f-3'])
    );
    expect(batch.totalAmount).toBe(0);
    expect(batch.freelancerCount).toBe(0);
    expect(batch.worklogCount).toBe(0);
    expect(batch.entryCount).toBe(0);
  });

  it('returns empty batch when all worklogs are excluded', () => {
    const batch = buildPaymentBatch(
      [wl1, wl2, wl3, wl4],
      freelancersMap,
      timeEntriesMap,
      new Set(['wl-1', 'wl-2', 'wl-3', 'wl-4']),
      new Set()
    );
    expect(batch.totalAmount).toBe(0);
    expect(batch.freelancerCount).toBe(0);
    expect(batch.worklogCount).toBe(0);
  });
});
