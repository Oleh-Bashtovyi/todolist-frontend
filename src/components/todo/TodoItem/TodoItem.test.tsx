import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import '@testing-library/jest-dom'
import type { ITodoItem, TodoStatus } from '@types';

// Mock of Ant Design components
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Modal: {
      ...actual.Modal,
      confirm: jest.fn(),
    },
  };
});

describe('TodoItem', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();

  const baseTodo: ITodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test description',
    status: 'Todo' as TodoStatus,
    isCompleted: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render todo item with title and description', () => {
      render(<TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render todo item without description when not provided', () => {
      const todoWithoutDescription = { ...baseTodo, description: undefined };
      render(<TodoItem
          todo={todoWithoutDescription}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('should show overdue indicator for past due date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const overdueTodo: ITodoItem = {
        ...baseTodo,
        dueDate: pastDate,
        isCompleted: false
      };

      render(<TodoItem
          todo={overdueTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    });

    it('should not show overdue for completed tasks', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const completedOverdueTodo = {
        ...baseTodo,
        dueDate: pastDate,
        isCompleted: true
      };

      render(<TodoItem
          todo={completedOverdueTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should apply correct CSS classes for completed todo', () => {
      const completedTodo = { ...baseTodo, isCompleted: true };

      render(
        <TodoItem
          todo={completedTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const card = screen.getByTestId('todo-card');
      expect(card).toHaveClass('todoCard', 'completed');
    });

    it('should apply overdue class for overdue todos', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const overdueTodo = {
        ...baseTodo,
        dueDate: pastDate,
        isCompleted: false
      };

      render(
        <TodoItem
          todo={overdueTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const card = screen.getByTestId('todo-card');
      expect(card).toHaveClass('todoCard', 'overdue');
    });
  });

  describe('Status Display', () => {
    it('should display correct status tag for Todo status', () => {
      render(
        <TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      // Use more specific query to find the status tag specifically
      const statusTag = screen.getByTestId('status-tag');
      expect(statusTag).toHaveTextContent('To Do');
    });

    it('should display correct status tag for InProgress status', () => {
      const inProgressTodo = { ...baseTodo, status: 'InProgress' as TodoStatus };

      render(
        <TodoItem
          todo={inProgressTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      // Use more specific query to find the status tag specifically
      const statusTag = screen.getByTestId('status-tag');
      expect(statusTag).toHaveTextContent('In Progress');
    });

    it('should display correct status tag for Done status', () => {
      const doneTodo = { ...baseTodo, status: 'Done' as TodoStatus };

      render(
        <TodoItem
          todo={doneTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}
        />
      );

      // Use more specific query to find the status tag specifically
      const statusTag = screen.getByTestId('status-tag');
      expect(statusTag).toHaveTextContent('Done');
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const editButton = screen.getByTestId('edit-button');

      expect(editButton).toBeInTheDocument();
      await user.click(editButton!);

      expect(mockOnEdit).toHaveBeenCalledWith(baseTodo);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const deleteButton = screen.getByTestId('delete-button');

      expect(deleteButton).toBeInTheDocument();
      await user.click(deleteButton!);

      expect(mockOnDelete).toHaveBeenCalledWith(baseTodo.id);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onStatusChange when status button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const inProgressButton = screen.getByTestId('in-progress-button');

      expect(inProgressButton).toBeInTheDocument();
      await user.click(inProgressButton!);
      expect(mockOnStatusChange).toHaveBeenCalledWith(baseTodo.id, 'InProgress');
      expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    });

    it('should highlight current status button', () => {
      const inProgressTodo: ITodoItem = { ...baseTodo, status: 'InProgress' as TodoStatus };
      render(<TodoItem
          todo={inProgressTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const inProgressButton = screen.getByTestId('in-progress-button');
      expect(inProgressButton).toHaveClass('ant-btn-primary');
    });
  });

  describe('Accessibility', () => {
    it('should have buttons', () => {
      render(<TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      const editButton = screen.getByTestId('edit-button');
      const deleteButton = screen.getByTestId('delete-button');
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing due date gracefully', () => {
      const todoWithoutDueDate: ITodoItem = { ...baseTodo, dueDate: undefined };
      render(<TodoItem
          todo={todoWithoutDueDate}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);
      expect(screen.queryByTestId('calendar-icon')).not.toBeInTheDocument();
    });

    it('should handle empty title', () => {
      const todoWithEmptyTitle: ITodoItem = { ...baseTodo, title: '' };
      render(<TodoItem
          todo={todoWithEmptyTitle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);
      expect(screen.getByTestId('todo-card')).toBeInTheDocument();
    });

    it('should handle missing description gracefully', () => {
      const todoWithoutDescription: ITodoItem = { ...baseTodo, description: '' };
      render(<TodoItem
          todo={todoWithoutDescription}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });
  });
});