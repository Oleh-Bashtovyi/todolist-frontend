import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';
import type { ITodoFilter } from '@types';
import { TodoStatusEnum } from '@types';

const mockFilters: ITodoFilter = {
  status: undefined,
  overdue: undefined,
  searchTerm: undefined
};

const mockOnFilterChange = jest.fn();

describe('TodoFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all filter elements correctly', () => {
    render(<TodoFilter
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}/>);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    expect(screen.getByText('Filter by status')).toBeInTheDocument();
    expect(screen.getByText('Show overdue only')).toBeInTheDocument();
  });

  it('should handle status filter changes', async () => {
    const user = userEvent.setup();

    render(<TodoFilter
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}/>);

    const statusSelect = screen.getByRole('combobox');
    await user.click(statusSelect);
    const inProgressOption = screen.getByText('In Progress');
    await user.click(inProgressOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      status: TodoStatusEnum.InProgress
    });
  });

  it('should handle overdue checkbox changes', async () => {
    const user = userEvent.setup();

    render(<TodoFilter
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}/>);

    const overdueCheckbox = screen.getByRole('checkbox', { name: /show overdue only/i });

    await user.click(overdueCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      overdue: true
    });
  });

  it('should display current filter values correctly', () => {
    const activeFilters: ITodoFilter = {
      status: TodoStatusEnum.Done,
      overdue: true,
      searchTerm: 'existing search'
    };

    render(
      <TodoFilter
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}/>);

    const searchInput = screen.getByDisplayValue('existing search');
    expect(searchInput).toBeInTheDocument();

    const overdueCheckbox = screen.getByRole('checkbox', { name: /show overdue only/i });
    expect(overdueCheckbox).toBeChecked();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});