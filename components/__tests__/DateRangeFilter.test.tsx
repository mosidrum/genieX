import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangeFilter from '../DateRangeFilter';

function setup(props: Partial<React.ComponentProps<typeof DateRangeFilter>> = {}) {
  const onChange = vi.fn();
  const onClear = vi.fn();
  render(
    <DateRangeFilter
      startDate={null}
      endDate={null}
      onChange={onChange}
      onClear={onClear}
      {...props}
    />
  );
  return { onChange, onClear };
}

// Requirement 3.1: Dashboard SHALL provide a date range selector with start date and end date inputs
describe('DateRangeFilter rendering', () => {
  it('renders start date input labeled From', () => {
    setup();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
  });

  it('renders end date input labeled To', () => {
    setup();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
  });

  it('reflects the startDate prop value', () => {
    setup({ startDate: '2024-01-01' });
    expect(screen.getByLabelText(/from/i)).toHaveValue('2024-01-01');
  });

  it('reflects the endDate prop value', () => {
    setup({ endDate: '2024-01-31' });
    expect(screen.getByLabelText(/to/i)).toHaveValue('2024-01-31');
  });

  it('shows empty inputs when both dates are null', () => {
    setup();
    expect(screen.getByLabelText(/from/i)).toHaveValue('');
    expect(screen.getByLabelText(/to/i)).toHaveValue('');
  });
});

// Requirement 3.1: onChange is called with updated filter when dates change
describe('DateRangeFilter onChange', () => {
  it('calls onChange with new startDate when start input changes', async () => {
    const { onChange } = setup({ endDate: '2024-01-31' });
    await userEvent.type(screen.getByLabelText(/from/i), '2024-01-01');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ startDate: expect.any(String) })
    );
  });

  it('calls onChange with new endDate when end input changes', async () => {
    const { onChange } = setup({ startDate: '2024-01-01' });
    await userEvent.type(screen.getByLabelText(/to/i), '2024-01-31');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ endDate: expect.any(String) })
    );
  });
});

// Requirement 3.4: Dashboard SHALL allow clearing the date filter
describe('DateRangeFilter clear action', () => {
  it('does not show Clear button when both dates are null', () => {
    setup();
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('shows Clear button when startDate is set', () => {
    setup({ startDate: '2024-01-01' });
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('shows Clear button when endDate is set', () => {
    setup({ endDate: '2024-01-31' });
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls onClear when Clear button is clicked', async () => {
    const { onClear } = setup({ startDate: '2024-01-01' });
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});

// Requirement 3.1: validation — start date must be <= end date
describe('DateRangeFilter validation', () => {
  it('shows no validation error when dates are valid (start < end)', () => {
    setup({ startDate: '2024-01-01', endDate: '2024-01-31' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows no validation error when start equals end', () => {
    setup({ startDate: '2024-01-15', endDate: '2024-01-15' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows validation error when start date is after end date', () => {
    setup({ startDate: '2024-02-01', endDate: '2024-01-01' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/start date must be before or equal/i);
  });

  it('shows no validation error when only startDate is set', () => {
    setup({ startDate: '2024-01-01' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows no validation error when only endDate is set', () => {
    setup({ endDate: '2024-01-31' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
