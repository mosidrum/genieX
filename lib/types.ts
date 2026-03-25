export interface Freelancer {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface Worklog {
  id: string;
  taskName: string;
  freelancerId: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TimeEntry {
  id: string;
  worklogId: string;
  date: string;
  hoursWorked: number;
}

export interface DateFilter {
  startDate: string | null;
  endDate: string | null;
}

export interface WorklogSummary {
  worklog: Worklog;
  freelancer: Freelancer;
  totalHours: number;
  totalEarnings: number;
  entryCount: number;
}

export interface PaymentBatch {
  worklogs: WorklogSummary[];
  totalAmount: number;
  freelancerCount: number;
  worklogCount: number;
  entryCount: number;
}
