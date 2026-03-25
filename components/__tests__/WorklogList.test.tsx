import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorklogList from '../WorklogList'
import type { Worklog, Freelancer, TimeEntry, DateFilter } from '@/lib/types'

// Minimal test fixtures
const freelancerAlice: Freelancer = { id: 'f-1', name: 'Alice Johnson', hourlyRate: 75 }
const freelancerBob: Freelancer = { id: 'f-2', name: 'Bob Smith', hourlyRate: 100 }

const worklog1: Worklog = { id: 'w-1', taskName: 'Frontend Development', freelancerId: 'f-1', status: 'completed' }
const worklog2: Worklog = { id: 'w-2', taskName: 'API Integration', freelancerId: 'f-2', status: 'in_progress' }

const entries1: TimeEntry[] = [
  { id: 'e-1', worklogId: 'w-1', date: '2025-12-02', hoursWorked: 8 },
  { id: 'e-2', worklogId: 'w-1', date: '2025-12-05', hoursWorked: 4 },
]
const entries2: TimeEntry[] = [
  { id: 'e-3', worklogId: 'w-2', date: '2025-12-10', hoursWorked: 6 },
]

const noFilter: DateFilter = { startDate: null, endDate: null }

function buildFreelancers(...fs: Freelancer[]): Map<string, Freelancer> {
  return new Map(fs.map((f) => [f.id, f]))
}

function buildTimeEntries(entries: Record<string, TimeEntry[]>): Map<string, TimeEntry[]> {
  return new Map(Object.entries(entries))
}

function setup(overrides: Partial<React.ComponentProps<typeof WorklogList>> = {}) {
  const onDateFilterChange = vi.fn()
  const onWorklogSelect = vi.fn()
  const onWorklogClick = vi.fn()

  render(
    <WorklogList
      worklogs={[worklog1, worklog2]}
      freelancers={buildFreelancers(freelancerAlice, freelancerBob)}
      timeEntries={buildTimeEntries({ 'w-1': entries1, 'w-2': entries2 })}
      dateFilter={noFilter}
      selectedIds={new Set()}
      onDateFilterChange={onDateFilterChange}
      onWorklogSelect={onWorklogSelect}
      onWorklogClick={onWorklogClick}
      {...overrides}
    />
  )

  return { onDateFilterChange, onWorklogSelect, onWorklogClick }
}

// Requirement 1.1: Dashboard SHALL display a list of worklogs
describe('WorklogList rendering with data', () => {
  it('displays freelancer names', () => {
    setup()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('displays task names', () => {
    setup()
    expect(screen.getByText('Frontend Development')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
  })

  it('displays entry counts', () => {
    setup()
    // Alice has 2 entries, Bob has 1
    const cells = screen.getAllByRole('cell')
    const cellTexts = cells.map((c) => c.textContent)
    expect(cellTexts).toContain('2')
    expect(cellTexts).toContain('1')
  })

  it('displays calculated earnings for Alice (12h * $75 = $900.00)', () => {
    setup()
    expect(screen.getByText('$900.00')).toBeInTheDocument()
  })

  it('displays calculated earnings for Bob (6h * $100 = $600.00)', () => {
    setup()
    expect(screen.getByText('$600.00')).toBeInTheDocument()
  })

  it('displays total hours for Alice (12.0h)', () => {
    setup()
    expect(screen.getByText('12.0h')).toBeInTheDocument()
  })

  it('renders a checkbox for each worklog row', () => {
    setup()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('renders status badges', () => {
    setup()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})

// Requirement 3.5: Dashboard SHALL allow selecting worklogs via checkboxes
describe('WorklogList selection handling', () => {
  it('calls onWorklogSelect with the worklog id when checkbox is clicked', async () => {
    const { onWorklogSelect } = setup()
    const checkbox = screen.getByRole('checkbox', { name: /select worklog frontend development/i })
    await userEvent.click(checkbox)
    expect(onWorklogSelect).toHaveBeenCalledWith('w-1')
  })

  it('calls onWorklogSelect for the correct worklog when second checkbox is clicked', async () => {
    const { onWorklogSelect } = setup()
    const checkbox = screen.getByRole('checkbox', { name: /select worklog api integration/i })
    await userEvent.click(checkbox)
    expect(onWorklogSelect).toHaveBeenCalledWith('w-2')
  })

  it('renders checkbox as checked when worklog id is in selectedIds', () => {
    setup({ selectedIds: new Set(['w-1']) })
    const checkbox = screen.getByRole('checkbox', { name: /select worklog frontend development/i })
    expect(checkbox).toBeChecked()
  })

  it('renders checkbox as unchecked when worklog id is not in selectedIds', () => {
    setup({ selectedIds: new Set(['w-1']) })
    const checkbox = screen.getByRole('checkbox', { name: /select worklog api integration/i })
    expect(checkbox).not.toBeChecked()
  })
})

// Requirement 4.1: Dashboard SHALL support clicking a worklog row to navigate
describe('WorklogList row click navigation', () => {
  it('calls onWorklogClick with the worklog id when a row is clicked', async () => {
    const { onWorklogClick } = setup()
    await userEvent.click(screen.getByText('Frontend Development'))
    expect(onWorklogClick).toHaveBeenCalledWith('w-1')
  })

  it('calls onWorklogClick for the correct worklog when second row is clicked', async () => {
    const { onWorklogClick } = setup()
    await userEvent.click(screen.getByText('API Integration'))
    expect(onWorklogClick).toHaveBeenCalledWith('w-2')
  })

  it('does not call onWorklogClick when checkbox is clicked (stopPropagation)', async () => {
    const { onWorklogClick } = setup()
    const checkbox = screen.getByRole('checkbox', { name: /select worklog frontend development/i })
    await userEvent.click(checkbox)
    expect(onWorklogClick).not.toHaveBeenCalled()
  })
})

// Requirement 1.1: Empty states
describe('WorklogList empty states', () => {
  it('shows "No worklogs available" when worklogs array is empty', () => {
    setup({
      worklogs: [],
      freelancers: buildFreelancers(),
      timeEntries: buildTimeEntries({}),
    })
    expect(screen.getByText(/no worklogs available/i)).toBeInTheDocument()
  })

  it('does not render the table when worklogs array is empty', () => {
    setup({
      worklogs: [],
      freelancers: buildFreelancers(),
      timeEntries: buildTimeEntries({}),
    })
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows "No worklogs found for the selected date range" when filter matches nothing', () => {
    // entries are in Dec 2025; filter to a range with no entries
    setup({
      dateFilter: { startDate: '2030-01-01', endDate: '2030-01-31' },
    })
    expect(screen.getByText(/no worklogs found for the selected date range/i)).toBeInTheDocument()
  })

  it('does not render the table when filter matches nothing', () => {
    setup({
      dateFilter: { startDate: '2030-01-01', endDate: '2030-01-31' },
    })
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
