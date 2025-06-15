import {render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from './TodoFilter';
import type { ITodoFilter } from '@types';
import { TodoStatusEnum } from '@types';

describe('TodoFilter', () => {
  const mockOnFilterChange = jest.fn();

  const mockFilters: ITodoFilter = {
    status: undefined,
    overdue: undefined,
    searchTerm: undefined
  };

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

    const overdueCheckbox = screen.getByTestId('overdue-search-input');

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

    render(<TodoFilter
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}/>);

    const searchInput = screen.getByTestId('text-search-input');
    expect(searchInput).toBeInTheDocument();

    const overdueCheckbox = screen.getByTestId('overdue-search-input');
    expect(overdueCheckbox).toBeChecked();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});