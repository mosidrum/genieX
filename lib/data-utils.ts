import type { Worklog, Freelancer, TimeEntry, DateFilter, WorklogSummary, PaymentBatch } from './types'

export function calculateWorklogSummary(
  worklog: Worklog,
  freelancer: Freelancer,
  timeEntries: TimeEntry[]
): WorklogSummary {
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0)
  return {
    worklog,
    freelancer,
    totalHours,
    totalEarnings: totalHours * freelancer.hourlyRate,
    entryCount: timeEntries.length,
  }
}

export function filterWorklogsByDateRange(
  worklogs: Worklog[],
  timeEntriesMap: Map<string, TimeEntry[]>,
  dateFilter: DateFilter
): Worklog[] {
  const { startDate, endDate } = dateFilter
  if (startDate === null && endDate === null) return worklogs

  return worklogs.filter((worklog) => {
    const entries = timeEntriesMap.get(worklog.id) ?? []
    return entries.some((entry) => {
      if (startDate !== null && entry.date < startDate) return false
      if (endDate !== null && entry.date > endDate) return false
      return true
    })
  })
}

export function buildPaymentBatch(
  worklogs: Worklog[],
  freelancers: Map<string, Freelancer>,
  timeEntries: Map<string, TimeEntry[]>,
  excludedWorklogIds: Set<string>,
  excludedFreelancerIds: Set<string>
): PaymentBatch {
  const included = worklogs.filter(
    (w) => !excludedWorklogIds.has(w.id) && !excludedFreelancerIds.has(w.freelancerId)
  )

  const summaries: WorklogSummary[] = included.map((worklog) => {
    const freelancer = freelancers.get(worklog.freelancerId) ?? {
      id: worklog.freelancerId,
      name: 'Unknown Freelancer',
      hourlyRate: 0,
    }
    const entries = timeEntries.get(worklog.id) ?? []
    return calculateWorklogSummary(worklog, freelancer, entries)
  })

  const uniqueFreelancerIds = new Set(summaries.map((s) => s.freelancer.id))

  return {
    worklogs: summaries,
    totalAmount: summaries.reduce((sum, s) => sum + s.totalEarnings, 0),
    freelancerCount: uniqueFreelancerIds.size,
    worklogCount: summaries.length,
    entryCount: summaries.reduce((sum, s) => sum + s.entryCount, 0),
  }
}
