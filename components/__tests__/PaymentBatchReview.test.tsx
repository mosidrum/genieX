import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentBatchReview from '../PaymentBatchReview'
import type { Worklog, Freelancer, TimeEntry } from '@/lib/types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const alice: Freelancer = { id: 'f-1', name: 'Alice Johnson', hourlyRate: 100 }
const bob: Freelancer = { id: 'f-2', name: 'Bob Smith', hourlyRate: 50 }

const worklog1: Worklog = { id: 'w-1', taskName: 'Frontend Dev', freelancerId: 'f-1', status: 'completed' }
const worklog2: Worklog = { id: 'w-2', taskName: 'API Integration', freelancerId: 'f-1', status: 'in_progress' }
const worklog3: Worklog = { id: 'w-3', taskName: 'Backend Work', freelancerId: 'f-2', status: 'pending' }

// Alice w-1: 4h * $100 = $400
const entries1: TimeEntry[] = [
  { id: 'e-1', worklogId: 'w-1', date: '2025-12-01', hoursWorked: 4 },
]
// Alice w-2: 6h * $100 = $600
const entries2: TimeEntry[] = [
  { id: 'e-2', worklogId: 'w-2', date: '2025-12-02', hoursWorked: 6 },
]
// Bob w-3: 8h * $50 = $400
const entries3: TimeEntry[] = [
  { id: 'e-3', worklogId: 'w-3', date: '2025-12-03', hoursWorked: 8 },
]

function buildFreelancers(...fs: Freelancer[]): Map<string, Freelancer> {
  return new Map(fs.map((f) => [f.id, f]))
}

function buildTimeEntries(entries: Record<string, TimeEntry[]>): Map<string, TimeEntry[]> {
  return new Map(Object.entries(entries))
}

const defaultTimeEntries = buildTimeEntries({ 'w-1': entries1, 'w-2': entries2, 'w-3': entries3 })
const defaultFreelancers = buildFreelancers(alice, bob)

interface SetupOptions {
  selectedWorklogs?: Worklog[]
  freelancers?: Map<string, Freelancer>
  timeEntries?: Map<string, TimeEntry[]>
  excludedWorklogIds?: Set<string>
  excludedFreelancerIds?: Set<string>
}

function setup(overrides: SetupOptions = {}) {
  const onExcludeWorklog = vi.fn()
  const onExcludeFreelancer = vi.fn()
  const onIncludeWorklog = vi.fn()
  const onIncludeFreelancer = vi.fn()
  const onConfirm = vi.fn()

  render(
    <PaymentBatchReview
      selectedWorklogs={overrides.selectedWorklogs ?? [worklog1, worklog2, worklog3]}
      freelancers={overrides.freelancers ?? defaultFreelancers}
      timeEntries={overrides.timeEntries ?? defaultTimeEntries}
      excludedWorklogIds={overrides.excludedWorklogIds ?? new Set()}
      excludedFreelancerIds={overrides.excludedFreelancerIds ?? new Set()}
      onExcludeWorklog={onExcludeWorklog}
      onExcludeFreelancer={onExcludeFreelancer}
      onIncludeWorklog={onIncludeWorklog}
      onIncludeFreelancer={onIncludeFreelancer}
      onConfirm={onConfirm}
    />
  )

  return { onExcludeWorklog, onExcludeFreelancer, onIncludeWorklog, onIncludeFreelancer, onConfirm }
}

// ── Requirement 4.2: Payment batch summary display ────────────────────────────

describe('PaymentBatchReview rendering', () => {
  it('renders the Payment Batch Summary heading', () => {
    setup()
    expect(screen.getByText('Payment Batch Summary')).toBeInTheDocument()
  })

  it('displays all freelancer names', () => {
    setup()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('displays all task names', () => {
    setup()
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
    expect(screen.getByText('Backend Work')).toBeInTheDocument()
  })

  it('shows correct total amount: $400 + $600 + $400 = $1400.00', () => {
    setup()
    // Summary card shows "$1400.00" as a single text node
    expect(screen.getAllByText('$1400.00').length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct freelancer count (2)', () => {
    setup()
    const label = screen.getByText('Freelancers')
    expect(label.nextElementSibling?.textContent).toBe('2')
  })

  it('shows correct worklog count (3)', () => {
    setup()
    const label = screen.getByText('Worklogs')
    expect(label.nextElementSibling?.textContent).toBe('3')
  })

  it('shows correct entry count (3)', () => {
    setup()
    const label = screen.getByText('Time Entries')
    expect(label.nextElementSibling?.textContent).toBe('3')
  })

  it('renders an Exclude button for each worklog', () => {
    setup()
    const excludeButtons = screen.getAllByRole('button', { name: /^exclude$/i })
    expect(excludeButtons).toHaveLength(3)
  })

  it('renders an "Exclude all" button for each freelancer', () => {
    setup()
    const excludeAllButtons = screen.getAllByRole('button', { name: /exclude all/i })
    expect(excludeAllButtons).toHaveLength(2)
  })

  it('confirm button is enabled when worklogs are included', () => {
    setup()
    const confirmBtn = screen.getByRole('button', { name: /confirm payment/i })
    expect(confirmBtn).not.toBeDisabled()
  })
})

// ── Requirement 5.1: Worklog exclusion ────────────────────────────────────────

describe('worklog exclusion actions', () => {
  it('calls onExcludeWorklog with the correct id when Exclude is clicked', async () => {
    const { onExcludeWorklog } = setup()
    const [firstExclude] = screen.getAllByRole('button', { name: /^exclude$/i })
    await userEvent.click(firstExclude)
    expect(onExcludeWorklog).toHaveBeenCalledTimes(1)
    expect(onExcludeWorklog).toHaveBeenCalledWith(expect.any(String))
  })

  it('shows "Re-include" button for an excluded worklog', () => {
    setup({ excludedWorklogIds: new Set(['w-1']) })
    expect(screen.getByRole('button', { name: /re-include$/i })).toBeInTheDocument()
  })

  it('calls onIncludeWorklog with the correct id when Re-include is clicked', async () => {
    const { onIncludeWorklog } = setup({ excludedWorklogIds: new Set(['w-1']) })
    await userEvent.click(screen.getByRole('button', { name: /re-include$/i }))
    expect(onIncludeWorklog).toHaveBeenCalledWith('w-1')
  })

  it('shows "Excluded" badge on an excluded worklog', () => {
    setup({ excludedWorklogIds: new Set(['w-1']) })
    expect(screen.getByText('Excluded')).toBeInTheDocument()
  })

  it('applies line-through style to excluded worklog task name', () => {
    setup({ excludedWorklogIds: new Set(['w-1']) })
    const taskName = screen.getByText('Frontend Dev')
    expect(taskName.className).toMatch(/line-through/)
  })
})

// ── Requirement 5.2: Freelancer exclusion ─────────────────────────────────────

describe('freelancer exclusion actions', () => {
  it('calls onExcludeFreelancer with the correct id when "Exclude all" is clicked', async () => {
    const { onExcludeFreelancer } = setup()
    const [firstExcludeAll] = screen.getAllByRole('button', { name: /exclude all/i })
    await userEvent.click(firstExcludeAll)
    expect(onExcludeFreelancer).toHaveBeenCalledTimes(1)
    expect(onExcludeFreelancer).toHaveBeenCalledWith(expect.any(String))
  })

  it('shows "Re-include freelancer" button when freelancer is excluded', () => {
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    expect(screen.getByRole('button', { name: /re-include freelancer/i })).toBeInTheDocument()
  })

  it('calls onIncludeFreelancer with the correct id when Re-include freelancer is clicked', async () => {
    const { onIncludeFreelancer } = setup({ excludedFreelancerIds: new Set(['f-1']) })
    await userEvent.click(screen.getByRole('button', { name: /re-include freelancer/i }))
    expect(onIncludeFreelancer).toHaveBeenCalledWith('f-1')
  })

  it('shows "Excluded" badge on the excluded freelancer header', () => {
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    expect(screen.getByText('Excluded')).toBeInTheDocument()
  })

  it('applies line-through style to excluded freelancer name', () => {
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    const name = screen.getByText('Alice Johnson')
    expect(name.className).toMatch(/line-through/)
  })

  it('hides per-worklog Exclude buttons when freelancer is excluded', () => {
    // When freelancer is excluded, individual worklog exclude buttons should not appear
    // for that freelancer's worklogs
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    // Only Bob's worklog should have an Exclude button
    const excludeButtons = screen.getAllByRole('button', { name: /^exclude$/i })
    expect(excludeButtons).toHaveLength(1)
  })
})

// ── Requirement 5.3: Total recalculation after exclusions ─────────────────────

describe('total recalculation after exclusions', () => {
  it('recalculates total when one worklog is excluded (w-1 excluded: $600 + $400 = $1000)', () => {
    setup({ excludedWorklogIds: new Set(['w-1']) })
    expect(screen.getAllByText('$1000.00').length).toBeGreaterThanOrEqual(1)
  })

  it('recalculates total when a freelancer is excluded (alice excluded: only bob $400)', () => {
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    const totalLabel = screen.getByText('Total Amount')
    expect(totalLabel.nextElementSibling?.textContent).toBe('$400.00')
  })

  it('shows $0.00 total when all worklogs are excluded', () => {
    setup({ excludedWorklogIds: new Set(['w-1', 'w-2', 'w-3']) })
    const totalLabel = screen.getByText('Total Amount')
    expect(totalLabel.nextElementSibling?.textContent).toBe('$0.00')
  })

  it('disables confirm button when all worklogs are excluded', () => {
    setup({ excludedWorklogIds: new Set(['w-1', 'w-2', 'w-3']) })
    const confirmBtn = screen.getByRole('button', { name: /confirm payment/i })
    expect(confirmBtn).toBeDisabled()
  })

  it('disables confirm button when all freelancers are excluded', () => {
    setup({ excludedFreelancerIds: new Set(['f-1', 'f-2']) })
    const confirmBtn = screen.getByRole('button', { name: /confirm payment/i })
    expect(confirmBtn).toBeDisabled()
  })

  it('updates freelancer count when a freelancer is excluded', () => {
    setup({ excludedFreelancerIds: new Set(['f-1']) })
    // Only Bob remains → freelancerCount = 1
    const label = screen.getByText('Freelancers')
    expect(label.nextElementSibling?.textContent).toBe('1')
  })

  it('updates worklog count when a worklog is excluded', () => {
    setup({ excludedWorklogIds: new Set(['w-1']) })
    // 2 worklogs remain
    const label = screen.getByText('Worklogs')
    expect(label.nextElementSibling?.textContent).toBe('2')
  })
})

// ── Requirement 4.6: Confirm action ───────────────────────────────────────────

describe('confirm payment action', () => {
  it('calls onConfirm when the confirm button is clicked', async () => {
    const { onConfirm } = setup()
    await userEvent.click(screen.getByRole('button', { name: /confirm payment/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('does not call onConfirm when button is disabled (all excluded)', async () => {
    const { onConfirm } = setup({ excludedWorklogIds: new Set(['w-1', 'w-2', 'w-3']) })
    const confirmBtn = screen.getByRole('button', { name: /confirm payment/i })
    await userEvent.click(confirmBtn)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
