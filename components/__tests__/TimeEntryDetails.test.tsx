import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeEntryDetails from '../TimeEntryDetails';
import type { Worklog, Freelancer, TimeEntry } from '@/lib/types';

// Minimal test fixtures
const freelancer: Freelancer = { id: 'f-1', name: 'Alice Johnson', hourlyRate: 75 };

const worklog: Worklog = {
  id: 'w-1',
  taskName: 'Frontend Development',
  freelancerId: 'f-1',
  status: 'completed',
};

const timeEntries: TimeEntry[] = [
  { id: 'e-1', worklogId: 'w-1', date: '2025-12-02', hoursWorked: 8 },
  { id: 'e-2', worklogId: 'w-1', date: '2025-12-05', hoursWorked: 6 },
  { id: 'e-3', worklogId: 'w-1', date: '2025-12-10', hoursWorked: 7 },
];

function setup(overrides: Partial<React.ComponentProps<typeof TimeEntryDetails>> = {}) {
  const onBack = vi.fn();
  render(
    <TimeEntryDetails
      worklog={worklog}
      freelancer={freelancer}
      timeEntries={timeEntries}
      onBack={onBack}
      {...overrides}
    />
  );
  return { onBack };
}

// Requirement 2.1: When an admin selects a worklog, the Dashboard SHALL display all associated time entries
describe('TimeEntryDetails rendering with mock data', () => {
  it('displays the worklog task name', () => {
    setup();
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });

  it('displays the freelancer name', () => {
    setup();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('renders a row for each time entry', () => {
    setup();
    // 3 entries → 3 data rows in tbody
    const rows = screen.getAllByRole('row');
    // thead (1) + tbody rows (3) + tfoot (1) = 5
    expect(rows).toHaveLength(5);
  });

  it('displays each entry date', () => {
    setup();
    expect(screen.getByText('2025-12-02')).toBeInTheDocument();
    expect(screen.getByText('2025-12-05')).toBeInTheDocument();
    expect(screen.getByText('2025-12-10')).toBeInTheDocument();
  });

  it('displays each entry hours', () => {
    setup();
    expect(screen.getByText('8.0h')).toBeInTheDocument();
    expect(screen.getByText('6.0h')).toBeInTheDocument();
    expect(screen.getByText('7.0h')).toBeInTheDocument();
  });

  it('displays the hourly rate for each entry', () => {
    setup();
    // Rate column shows $75.00 for each row
    const rateCells = screen.getAllByText('$75.00');
    expect(rateCells.length).toBeGreaterThanOrEqual(3);
  });

  it('renders a back button', () => {
    setup();
    expect(screen.getByRole('button', { name: /back to worklogs/i })).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const { onBack } = setup();
    await userEvent.click(screen.getByRole('button', { name: /back to worklogs/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});

// Requirement 2.6: The Dashboard SHALL display the total hours and total earnings for the worklog
describe('TimeEntryDetails calculations', () => {
  it('displays the correct total hours (8 + 6 + 7 = 21h)', () => {
    setup();
    // Total row in tfoot + summary header both show 21.0h
    const totalHoursElements = screen.getAllByText('21.0h');
    expect(totalHoursElements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays the correct total earnings (21h * $75 = $1575.00)', () => {
    setup();
    const totalEarningsElements = screen.getAllByText('$1575.00');
    expect(totalEarningsElements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays per-entry earnings correctly (8h * $75 = $600.00)', () => {
    setup();
    expect(screen.getByText('$600.00')).toBeInTheDocument();
  });

  it('displays per-entry earnings correctly (6h * $75 = $450.00)', () => {
    setup();
    expect(screen.getByText('$450.00')).toBeInTheDocument();
  });

  it('displays per-entry earnings correctly (7h * $75 = $525.00)', () => {
    setup();
    expect(screen.getByText('$525.00')).toBeInTheDocument();
  });

  it('shows total hours label', () => {
    setup();
    expect(screen.getByText(/total hours/i)).toBeInTheDocument();
  });

  it('shows total earnings label', () => {
    setup();
    expect(screen.getByText(/total earnings/i)).toBeInTheDocument();
  });
});

// Requirement 2.1: Empty state when no time entries exist
describe('TimeEntryDetails empty state', () => {
  it('shows empty state message when timeEntries is empty', () => {
    setup({ timeEntries: [] });
    expect(screen.getByText(/no time entries for this worklog/i)).toBeInTheDocument();
  });

  it('does not render a table when timeEntries is empty', () => {
    setup({ timeEntries: [] });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows 0.0h total hours when timeEntries is empty', () => {
    setup({ timeEntries: [] });
    expect(screen.getByText('0.0h')).toBeInTheDocument();
  });

  it('shows $0.00 total earnings when timeEntries is empty', () => {
    setup({ timeEntries: [] });
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
