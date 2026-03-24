import type { Freelancer, Worklog, TimeEntry } from './types'

export const mockFreelancers: Freelancer[] = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Alice Johnson', hourlyRate: 75 },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Bob Smith', hourlyRate: 85 },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Carol Davis', hourlyRate: 95 },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'David Wilson', hourlyRate: 80 },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Emma Brown', hourlyRate: 90 },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Frank Miller', hourlyRate: 70 },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Grace Lee', hourlyRate: 100 },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Henry Taylor', hourlyRate: 85 },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Iris Chen', hourlyRate: 95 },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Jack Anderson', hourlyRate: 75 },
]

export const mockWorklogs: Worklog[] = [
  { id: 'work-650e8400-e29b-41d4-a716-446655440001', taskName: 'Frontend Development', freelancerId: '550e8400-e29b-41d4-a716-446655440001', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440002', taskName: 'API Integration', freelancerId: '550e8400-e29b-41d4-a716-446655440001', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440003', taskName: 'UI Design', freelancerId: '550e8400-e29b-41d4-a716-446655440002', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440004', taskName: 'Database Schema', freelancerId: '550e8400-e29b-41d4-a716-446655440002', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440005', taskName: 'Authentication Module', freelancerId: '550e8400-e29b-41d4-a716-446655440003', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440006', taskName: 'Payment Gateway', freelancerId: '550e8400-e29b-41d4-a716-446655440003', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440007', taskName: 'Mobile Responsive Layout', freelancerId: '550e8400-e29b-41d4-a716-446655440004', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440008', taskName: 'Search Functionality', freelancerId: '550e8400-e29b-41d4-a716-446655440004', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440009', taskName: 'Email Notifications', freelancerId: '550e8400-e29b-41d4-a716-446655440005', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440010', taskName: 'Dashboard Analytics', freelancerId: '550e8400-e29b-41d4-a716-446655440005', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440011', taskName: 'Unit Testing Suite', freelancerId: '550e8400-e29b-41d4-a716-446655440006', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440012', taskName: 'CI/CD Pipeline', freelancerId: '550e8400-e29b-41d4-a716-446655440006', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440013', taskName: 'Performance Optimization', freelancerId: '550e8400-e29b-41d4-a716-446655440007', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440014', taskName: 'Security Audit', freelancerId: '550e8400-e29b-41d4-a716-446655440007', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440015', taskName: 'Data Migration', freelancerId: '550e8400-e29b-41d4-a716-446655440008', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440016', taskName: 'Reporting Module', freelancerId: '550e8400-e29b-41d4-a716-446655440008', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440017', taskName: 'Third-party Integrations', freelancerId: '550e8400-e29b-41d4-a716-446655440009', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440018', taskName: 'Accessibility Improvements', freelancerId: '550e8400-e29b-41d4-a716-446655440009', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440019', taskName: 'Caching Layer', freelancerId: '550e8400-e29b-41d4-a716-446655440010', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440020', taskName: 'Logging & Monitoring', freelancerId: '550e8400-e29b-41d4-a716-446655440010', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440021', taskName: 'User Onboarding Flow', freelancerId: '550e8400-e29b-41d4-a716-446655440001', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440022', taskName: 'Admin Panel', freelancerId: '550e8400-e29b-41d4-a716-446655440002', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440023', taskName: 'File Upload Service', freelancerId: '550e8400-e29b-41d4-a716-446655440003', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440024', taskName: 'Notification Center', freelancerId: '550e8400-e29b-41d4-a716-446655440004', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440025', taskName: 'Subscription Management', freelancerId: '550e8400-e29b-41d4-a716-446655440005', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440026', taskName: 'Webhook Handlers', freelancerId: '550e8400-e29b-41d4-a716-446655440006', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440027', taskName: 'GraphQL Schema', freelancerId: '550e8400-e29b-41d4-a716-446655440007', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440028', taskName: 'Rate Limiting', freelancerId: '550e8400-e29b-41d4-a716-446655440008', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440029', taskName: 'Internationalization', freelancerId: '550e8400-e29b-41d4-a716-446655440009', status: 'completed' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440030', taskName: 'Dark Mode Support', freelancerId: '550e8400-e29b-41d4-a716-446655440010', status: 'in_progress' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440031', taskName: 'PDF Export', freelancerId: '550e8400-e29b-41d4-a716-446655440001', status: 'pending' },
  { id: 'work-650e8400-e29b-41d4-a716-446655440032', taskName: 'Bulk Import Tool', freelancerId: '550e8400-e29b-41d4-a716-446655440002', status: 'completed' },
]

export const mockTimeEntries: TimeEntry[] = [
  // work-01 (Alice - Frontend Development)
  { id: '750e8400-e29b-41d4-a716-446655440001', worklogId: 'work-650e8400-e29b-41d4-a716-446655440001', date: '2025-12-02', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440002', worklogId: 'work-650e8400-e29b-41d4-a716-446655440001', date: '2025-12-05', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440003', worklogId: 'work-650e8400-e29b-41d4-a716-446655440001', date: '2025-12-10', hoursWorked: 7 },
  // work-02 (Alice - API Integration)
  { id: '750e8400-e29b-41d4-a716-446655440004', worklogId: 'work-650e8400-e29b-41d4-a716-446655440002', date: '2026-01-08', hoursWorked: 5 },
  { id: '750e8400-e29b-41d4-a716-446655440005', worklogId: 'work-650e8400-e29b-41d4-a716-446655440002', date: '2026-01-12', hoursWorked: 9 },
  // work-03 (Bob - UI Design)
  { id: '750e8400-e29b-41d4-a716-446655440006', worklogId: 'work-650e8400-e29b-41d4-a716-446655440003', date: '2025-12-15', hoursWorked: 4 },
  { id: '750e8400-e29b-41d4-a716-446655440007', worklogId: 'work-650e8400-e29b-41d4-a716-446655440003', date: '2025-12-18', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440008', worklogId: 'work-650e8400-e29b-41d4-a716-446655440003', date: '2025-12-22', hoursWorked: 8 },
  // work-04 (Bob - Database Schema)
  { id: '750e8400-e29b-41d4-a716-446655440009', worklogId: 'work-650e8400-e29b-41d4-a716-446655440004', date: '2026-02-03', hoursWorked: 3 },
  { id: '750e8400-e29b-41d4-a716-446655440010', worklogId: 'work-650e8400-e29b-41d4-a716-446655440004', date: '2026-02-07', hoursWorked: 7 },
  // work-05 (Carol - Authentication Module)
  { id: '750e8400-e29b-41d4-a716-446655440011', worklogId: 'work-650e8400-e29b-41d4-a716-446655440005', date: '2025-12-08', hoursWorked: 10 },
  { id: '750e8400-e29b-41d4-a716-446655440012', worklogId: 'work-650e8400-e29b-41d4-a716-446655440005', date: '2025-12-11', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440013', worklogId: 'work-650e8400-e29b-41d4-a716-446655440005', date: '2025-12-16', hoursWorked: 6 },
  // work-06 (Carol - Payment Gateway)
  { id: '750e8400-e29b-41d4-a716-446655440014', worklogId: 'work-650e8400-e29b-41d4-a716-446655440006', date: '2026-01-20', hoursWorked: 9 },
  { id: '750e8400-e29b-41d4-a716-446655440015', worklogId: 'work-650e8400-e29b-41d4-a716-446655440006', date: '2026-01-24', hoursWorked: 5 },
  // work-07 (David - Mobile Responsive Layout)
  { id: '750e8400-e29b-41d4-a716-446655440016', worklogId: 'work-650e8400-e29b-41d4-a716-446655440007', date: '2025-12-03', hoursWorked: 7 },
  { id: '750e8400-e29b-41d4-a716-446655440017', worklogId: 'work-650e8400-e29b-41d4-a716-446655440007', date: '2025-12-09', hoursWorked: 4 },
  // work-08 (David - Search Functionality)
  { id: '750e8400-e29b-41d4-a716-446655440018', worklogId: 'work-650e8400-e29b-41d4-a716-446655440008', date: '2026-02-14', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440019', worklogId: 'work-650e8400-e29b-41d4-a716-446655440008', date: '2026-02-18', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440020', worklogId: 'work-650e8400-e29b-41d4-a716-446655440008', date: '2026-02-21', hoursWorked: 3 },
  // work-09 (Emma - Email Notifications)
  { id: '750e8400-e29b-41d4-a716-446655440021', worklogId: 'work-650e8400-e29b-41d4-a716-446655440009', date: '2025-12-17', hoursWorked: 5 },
  { id: '750e8400-e29b-41d4-a716-446655440022', worklogId: 'work-650e8400-e29b-41d4-a716-446655440009', date: '2025-12-20', hoursWorked: 7 },
  // work-10 (Emma - Dashboard Analytics)
  { id: '750e8400-e29b-41d4-a716-446655440023', worklogId: 'work-650e8400-e29b-41d4-a716-446655440010', date: '2026-01-15', hoursWorked: 10 },
  { id: '750e8400-e29b-41d4-a716-446655440024', worklogId: 'work-650e8400-e29b-41d4-a716-446655440010', date: '2026-01-19', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440025', worklogId: 'work-650e8400-e29b-41d4-a716-446655440010', date: '2026-01-23', hoursWorked: 8 },
  // work-11 (Frank - Unit Testing Suite)
  { id: '750e8400-e29b-41d4-a716-446655440026', worklogId: 'work-650e8400-e29b-41d4-a716-446655440011', date: '2025-12-04', hoursWorked: 4 },
  { id: '750e8400-e29b-41d4-a716-446655440027', worklogId: 'work-650e8400-e29b-41d4-a716-446655440011', date: '2025-12-08', hoursWorked: 6 },
  // work-12 (Frank - CI/CD Pipeline)
  { id: '750e8400-e29b-41d4-a716-446655440028', worklogId: 'work-650e8400-e29b-41d4-a716-446655440012', date: '2026-03-02', hoursWorked: 9 },
  { id: '750e8400-e29b-41d4-a716-446655440029', worklogId: 'work-650e8400-e29b-41d4-a716-446655440012', date: '2026-03-06', hoursWorked: 5 },
  // work-13 (Grace - Performance Optimization)
  { id: '750e8400-e29b-41d4-a716-446655440030', worklogId: 'work-650e8400-e29b-41d4-a716-446655440013', date: '2025-12-12', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440031', worklogId: 'work-650e8400-e29b-41d4-a716-446655440013', date: '2025-12-16', hoursWorked: 10 },
  { id: '750e8400-e29b-41d4-a716-446655440032', worklogId: 'work-650e8400-e29b-41d4-a716-446655440013', date: '2025-12-19', hoursWorked: 7 },
  // work-14 (Grace - Security Audit)
  { id: '750e8400-e29b-41d4-a716-446655440033', worklogId: 'work-650e8400-e29b-41d4-a716-446655440014', date: '2026-02-10', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440034', worklogId: 'work-650e8400-e29b-41d4-a716-446655440014', date: '2026-02-13', hoursWorked: 4 },
  // work-15 (Henry - Data Migration)
  { id: '750e8400-e29b-41d4-a716-446655440035', worklogId: 'work-650e8400-e29b-41d4-a716-446655440015', date: '2025-12-06', hoursWorked: 9 },
  { id: '750e8400-e29b-41d4-a716-446655440036', worklogId: 'work-650e8400-e29b-41d4-a716-446655440015', date: '2025-12-10', hoursWorked: 7 },
  // work-16 (Henry - Reporting Module)
  { id: '750e8400-e29b-41d4-a716-446655440037', worklogId: 'work-650e8400-e29b-41d4-a716-446655440016', date: '2026-03-10', hoursWorked: 5 },
  { id: '750e8400-e29b-41d4-a716-446655440038', worklogId: 'work-650e8400-e29b-41d4-a716-446655440016', date: '2026-03-14', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440039', worklogId: 'work-650e8400-e29b-41d4-a716-446655440016', date: '2026-03-18', hoursWorked: 3 },
  // work-17 (Iris - Third-party Integrations)
  { id: '750e8400-e29b-41d4-a716-446655440040', worklogId: 'work-650e8400-e29b-41d4-a716-446655440017', date: '2025-12-14', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440041', worklogId: 'work-650e8400-e29b-41d4-a716-446655440017', date: '2025-12-18', hoursWorked: 8 },
  // work-18 (Iris - Accessibility Improvements)
  { id: '750e8400-e29b-41d4-a716-446655440042', worklogId: 'work-650e8400-e29b-41d4-a716-446655440018', date: '2026-01-27', hoursWorked: 4 },
  { id: '750e8400-e29b-41d4-a716-446655440043', worklogId: 'work-650e8400-e29b-41d4-a716-446655440018', date: '2026-01-30', hoursWorked: 7 },
  { id: '750e8400-e29b-41d4-a716-446655440044', worklogId: 'work-650e8400-e29b-41d4-a716-446655440018', date: '2026-02-03', hoursWorked: 5 },
  // work-19 (Jack - Caching Layer)
  { id: '750e8400-e29b-41d4-a716-446655440045', worklogId: 'work-650e8400-e29b-41d4-a716-446655440019', date: '2025-12-22', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440046', worklogId: 'work-650e8400-e29b-41d4-a716-446655440019', date: '2025-12-26', hoursWorked: 6 },
  // work-20 (Jack - Logging & Monitoring)
  { id: '750e8400-e29b-41d4-a716-446655440047', worklogId: 'work-650e8400-e29b-41d4-a716-446655440020', date: '2026-03-05', hoursWorked: 3 },
  { id: '750e8400-e29b-41d4-a716-446655440048', worklogId: 'work-650e8400-e29b-41d4-a716-446655440020', date: '2026-03-09', hoursWorked: 9 },
  // work-21 (Alice - User Onboarding Flow)
  { id: '750e8400-e29b-41d4-a716-446655440049', worklogId: 'work-650e8400-e29b-41d4-a716-446655440021', date: '2026-01-05', hoursWorked: 7 },
  { id: '750e8400-e29b-41d4-a716-446655440050', worklogId: 'work-650e8400-e29b-41d4-a716-446655440021', date: '2026-01-09', hoursWorked: 5 },
  // work-22 (Bob - Admin Panel)
  { id: '750e8400-e29b-41d4-a716-446655440051', worklogId: 'work-650e8400-e29b-41d4-a716-446655440022', date: '2026-02-24', hoursWorked: 10 },
  { id: '750e8400-e29b-41d4-a716-446655440052', worklogId: 'work-650e8400-e29b-41d4-a716-446655440022', date: '2026-02-27', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440053', worklogId: 'work-650e8400-e29b-41d4-a716-446655440022', date: '2026-03-03', hoursWorked: 4 },
  // work-23 (Carol - File Upload Service)
  { id: '750e8400-e29b-41d4-a716-446655440054', worklogId: 'work-650e8400-e29b-41d4-a716-446655440023', date: '2026-01-13', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440055', worklogId: 'work-650e8400-e29b-41d4-a716-446655440023', date: '2026-01-17', hoursWorked: 5 },
  // work-24 (David - Notification Center)
  { id: '750e8400-e29b-41d4-a716-446655440056', worklogId: 'work-650e8400-e29b-41d4-a716-446655440024', date: '2026-03-12', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440057', worklogId: 'work-650e8400-e29b-41d4-a716-446655440024', date: '2026-03-16', hoursWorked: 9 },
  // work-25 (Emma - Subscription Management)
  { id: '750e8400-e29b-41d4-a716-446655440058', worklogId: 'work-650e8400-e29b-41d4-a716-446655440025', date: '2026-02-06', hoursWorked: 7 },
  { id: '750e8400-e29b-41d4-a716-446655440059', worklogId: 'work-650e8400-e29b-41d4-a716-446655440025', date: '2026-02-10', hoursWorked: 4 },
  { id: '750e8400-e29b-41d4-a716-446655440060', worklogId: 'work-650e8400-e29b-41d4-a716-446655440025', date: '2026-02-14', hoursWorked: 8 },
  // work-26 (Frank - Webhook Handlers)
  { id: '750e8400-e29b-41d4-a716-446655440061', worklogId: 'work-650e8400-e29b-41d4-a716-446655440026', date: '2026-03-07', hoursWorked: 5 },
  { id: '750e8400-e29b-41d4-a716-446655440062', worklogId: 'work-650e8400-e29b-41d4-a716-446655440026', date: '2026-03-11', hoursWorked: 7 },
  // work-27 (Grace - GraphQL Schema)
  { id: '750e8400-e29b-41d4-a716-446655440063', worklogId: 'work-650e8400-e29b-41d4-a716-446655440027', date: '2026-01-06', hoursWorked: 9 },
  { id: '750e8400-e29b-41d4-a716-446655440064', worklogId: 'work-650e8400-e29b-41d4-a716-446655440027', date: '2026-01-10', hoursWorked: 6 },
  { id: '750e8400-e29b-41d4-a716-446655440065', worklogId: 'work-650e8400-e29b-41d4-a716-446655440027', date: '2026-01-14', hoursWorked: 4 },
  // work-28 (Henry - Rate Limiting)
  { id: '750e8400-e29b-41d4-a716-446655440066', worklogId: 'work-650e8400-e29b-41d4-a716-446655440028', date: '2026-03-17', hoursWorked: 3 },
  { id: '750e8400-e29b-41d4-a716-446655440067', worklogId: 'work-650e8400-e29b-41d4-a716-446655440028', date: '2026-03-20', hoursWorked: 6 },
  // work-29 (Iris - Internationalization)
  { id: '750e8400-e29b-41d4-a716-446655440068', worklogId: 'work-650e8400-e29b-41d4-a716-446655440029', date: '2026-02-17', hoursWorked: 8 },
  { id: '750e8400-e29b-41d4-a716-446655440069', worklogId: 'work-650e8400-e29b-41d4-a716-446655440029', date: '2026-02-20', hoursWorked: 10 },
  // work-30 (Jack - Dark Mode Support)
  { id: '750e8400-e29b-41d4-a716-446655440070', worklogId: 'work-650e8400-e29b-41d4-a716-446655440030', date: '2026-03-13', hoursWorked: 5 },
  { id: '750e8400-e29b-41d4-a716-446655440071', worklogId: 'work-650e8400-e29b-41d4-a716-446655440030', date: '2026-03-19', hoursWorked: 7 },
  // work-31 (Alice - PDF Export)
  { id: '750e8400-e29b-41d4-a716-446655440072', worklogId: 'work-650e8400-e29b-41d4-a716-446655440031', date: '2026-03-21', hoursWorked: 4 },
  { id: '750e8400-e29b-41d4-a716-446655440073', worklogId: 'work-650e8400-e29b-41d4-a716-446655440031', date: '2026-03-24', hoursWorked: 6 },
  // work-32 (Bob - Bulk Import Tool)
  { id: '750e8400-e29b-41d4-a716-446655440074', worklogId: 'work-650e8400-e29b-41d4-a716-446655440032', date: '2026-02-28', hoursWorked: 9 },
  { id: '750e8400-e29b-41d4-a716-446655440075', worklogId: 'work-650e8400-e29b-41d4-a716-446655440032', date: '2026-03-04', hoursWorked: 7 },
  { id: '750e8400-e29b-41d4-a716-446655440076', worklogId: 'work-650e8400-e29b-41d4-a716-446655440032', date: '2026-03-08', hoursWorked: 5 },
]

export function getFreelancerById(id: string): Freelancer | undefined {
  return mockFreelancers.find((f) => f.id === id)
}

export function getWorklogsByFreelancerId(freelancerId: string): Worklog[] {
  return mockWorklogs.filter((w) => w.freelancerId === freelancerId)
}

export function getTimeEntriesByWorklogId(worklogId: string): TimeEntry[] {
  return mockTimeEntries.filter((e) => e.worklogId === worklogId)
}
