'use client'

import { useState, useEffect } from 'react'
import type { Freelancer, Worklog, TimeEntry, DateFilter } from '@/lib/types'
import { mockFreelancers, mockWorklogs, mockTimeEntries } from '@/lib/mock-data'
import { filterWorklogsByDateRange } from '@/lib/data-utils'
import WorklogList from '@/components/WorklogList'
import TimeEntryDetails from '@/components/TimeEntryDetails'
import PaymentBatchReview from '@/components/PaymentBatchReview'

type View = 'list' | 'details' | 'batch'

export default function DashboardPage() {
  const [worklogs, setWorklogs] = useState<Worklog[]>([])
  const [freelancers, setFreelancers] = useState<Map<string, Freelancer>>(new Map())
  const [timeEntriesMap, setTimeEntriesMap] = useState<Map<string, TimeEntry[]>>(new Map())

  useEffect(() => {
    const freelancerMap = new Map<string, Freelancer>(
      mockFreelancers.map((f) => [f.id, f])
    )

    const entriesMap = new Map<string, TimeEntry[]>()
    for (const entry of mockTimeEntries) {
      const existing = entriesMap.get(entry.worklogId) ?? []
      entriesMap.set(entry.worklogId, [...existing, entry])
    }

    setWorklogs(mockWorklogs)
    setFreelancers(freelancerMap)
    setTimeEntriesMap(entriesMap)
  }, [])

  const [dateFilter, setDateFilter] = useState<DateFilter>({ startDate: null, endDate: null })
  const [selectedWorklogIds, setSelectedWorklogIds] = useState<Set<string>>(new Set())
  const [excludedWorklogIds, setExcludedWorklogIds] = useState<Set<string>>(new Set())
  const [excludedFreelancerIds, setExcludedFreelancerIds] = useState<Set<string>>(new Set())
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedWorklogId, setSelectedWorklogId] = useState<string | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const selectedWorklog = selectedWorklogId ? worklogs.find((w) => w.id === selectedWorklogId) : null
  const selectedFreelancer = selectedWorklog ? freelancers.get(selectedWorklog.freelancerId) : null
  const selectedTimeEntries = selectedWorklogId ? (timeEntriesMap.get(selectedWorklogId) ?? []) : []
  const selectedWorklogs = worklogs.filter((w) => selectedWorklogIds.has(w.id))
  const filteredWorklogs = filterWorklogsByDateRange(worklogs, timeEntriesMap, dateFilter)

  function handleWorklogClick(id: string) {
    setSelectedWorklogId(id)
    setCurrentView('details')
  }

  function handleBackToList() {
    setSelectedWorklogId(null)
    setCurrentView('list')
  }

  function handleViewBatch() {
    setCurrentView('batch')
  }

  function handleBackFromBatch() {
    setCurrentView('list')
  }

  function handleConfirmPayment() {
    setSelectedWorklogIds(new Set())
    setExcludedWorklogIds(new Set())
    setExcludedFreelancerIds(new Set())
    setPaymentConfirmed(true)
    setCurrentView('list')
  }

  const selectedCount = selectedWorklogIds.size

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
            <button
              onClick={() => { setCurrentView('list'); setSelectedWorklogId(null) }}
              className="text-lg font-semibold text-gray-900 hover:text-blue-700 sm:text-xl"
            >
              WorkLog Payment Dashboard
            </button>
            {currentView === 'details' && selectedWorklog && (
              <>
                <span className="text-gray-400">/</span>
                <span className="truncate text-gray-500">{selectedWorklog.taskName}</span>
              </>
            )}
            {currentView === 'batch' && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">Payment Batch Review</span>
              </>
            )}
          </div>
          {currentView === 'list' && selectedCount > 0 && (
            <button
              onClick={handleViewBatch}
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Payment Batch ({selectedCount})
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {currentView === 'list' && (
          <>
            {paymentConfirmed && (
              <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <span>Payment batch confirmed successfully.</span>
                <button
                  onClick={() => setPaymentConfirmed(false)}
                  className="ml-4 text-green-600 hover:text-green-800"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
            <WorklogList
            worklogs={filteredWorklogs}
            freelancers={freelancers}
            timeEntries={timeEntriesMap}
            dateFilter={dateFilter}
            selectedIds={selectedWorklogIds}
            excludedIds={excludedWorklogIds}
            onDateFilterChange={(filter) => setDateFilter(filter)}
            onWorklogSelect={(id) => {
              setSelectedWorklogIds((prev) => {
                const next = new Set(prev)
                if (next.has(id)) {
                  next.delete(id)
                } else {
                  next.add(id)
                }
                return next
              })
            }}
            onWorklogClick={handleWorklogClick}
          />
          </>
        )}

        {currentView === 'details' && selectedWorklog && selectedFreelancer && (
          <TimeEntryDetails
            worklog={selectedWorklog}
            freelancer={selectedFreelancer}
            timeEntries={selectedTimeEntries}
            onBack={handleBackToList}
          />
        )}

        {currentView === 'batch' && (
          <PaymentBatchReview
            selectedWorklogs={selectedWorklogs}
            freelancers={freelancers}
            timeEntries={timeEntriesMap}
            excludedWorklogIds={excludedWorklogIds}
            excludedFreelancerIds={excludedFreelancerIds}
            onExcludeWorklog={(id) => setExcludedWorklogIds((prev) => new Set(prev).add(id))}
            onExcludeFreelancer={(id) => setExcludedFreelancerIds((prev) => new Set(prev).add(id))}
            onIncludeWorklog={(id) => setExcludedWorklogIds((prev) => { const next = new Set(prev); next.delete(id); return next })}
            onIncludeFreelancer={(id) => setExcludedFreelancerIds((prev) => { const next = new Set(prev); next.delete(id); return next })}
            onConfirm={handleConfirmPayment}
          />
        )}
      </main>
    </div>
  )
}
