import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import '@testing-library/jest-dom'
import type { ITodoItem, TodoStatus } from '@types';

// Mock of Ant Design components
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Modal: {
    confirm: jest.fn()
  },
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="todo-card">{children}</div>
  ),
  Typography: {
    Title: ({ children, className, level }: any) => (
      <div className={className} data-testid={`title-${level}`}>{children}</div>
    ),
    Text: ({ children, type, className }: any) => (
      <span className={`${className || ''} ${type || ''}`} data-testid="text">{children}</span>
    ),
  },
  Tag: ({ children, color }: any) => (
    <span className={`tag tag-${color}`} data-testid="status-tag">{children}</span>
  ),
  Button: ({ children, onClick, icon, type, size, danger, ...props }: any) => (
    <button
      {...props}
      onClick={onClick}
      className={`btn ${type || ''} ${size || ''} ${danger ? 'danger' : ''}`}
      data-testid="button"
    >
      {icon}
      {children}
    </button>
  ),
  Space: ({ children }: any) => <div className="space" data-testid="space">{children}</div>,
  Tooltip: ({ children, title }: any) => (
    <div title={title} data-testid="tooltip">{children}</div>
  ),
}));

jest.mock('@ant-design/icons', () => ({
  EditOutlined: () => <span data-testid="edit-icon">Edit</span>,
  DeleteOutlined: () => <span data-testid="delete-icon">Delete</span>,
  CalendarOutlined: () => <span data-testid="calendar-icon">Calendar</span>,
}));

// Mock CSS modules
jest.mock('./TodoItem.module.css', () => ({
  todoCard: 'todoCard',
  completed: 'completed',
  overdue: 'overdue',
  header: 'header',
  titleContainer: 'titleContainer',
  title: 'title',
  completedTitle: 'completedTitle',
  actions: 'actions',
  metadata: 'metadata',
  dateContainer: 'dateContainer',
  dateText: 'dateText',
  descriptionContainer: 'descriptionContainer',
  description: 'description',
  statusButtons: 'statusButtons'
}));

// Get access to mock functions after import
import {Modal} from 'antd';
const mockModalConfirm = Modal.confirm as jest.MockedFunction<typeof Modal.confirm>;

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
    mockModalConfirm.mockReset();
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
          onStatusChange={mockOnStatusChange}
        />
      );

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
          onStatusChange={mockOnStatusChange}
        />
      );

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
          onStatusChange={mockOnStatusChange}
        />
      );

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
          onStatusChange={mockOnStatusChange}
        />
      );

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
          onStatusChange={mockOnStatusChange}
        />
      );

      const editButtons = screen.getAllByTestId('button');
      const editButton = editButtons.find(btn =>
        btn.textContent?.includes('Edit')
      );

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

      const deleteButtons = screen.getAllByTestId('button');
      const deleteButton = deleteButtons.find(btn =>
        btn.textContent?.includes('Delete'));

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

      // Find the In Progress button among all buttons
      const allButtons = screen.getAllByTestId('button');
      const inProgressButton = allButtons.find(btn =>
        btn.textContent === 'In Progress' && !btn.textContent.includes('Edit') && !btn.textContent.includes('Delete')
      );

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

      const buttons = screen.getAllByTestId('button');
      const inProgressButton = buttons.find(btn =>
        btn.textContent === 'In Progress' && !btn.textContent.includes('Edit') && !btn.textContent.includes('Delete')
      );
      expect(inProgressButton).toHaveClass('primary');
    });

    it('should show confirmation modal when changing status from Done', async () => {
      const user = userEvent.setup();
      const doneTodo: ITodoItem = { ...baseTodo, status: 'Done' as TodoStatus };
      mockModalConfirm.mockImplementation(({ onOk }: any) => {
        onOk();
      });

      render(<TodoItem
          todo={doneTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);

      // Find the To Do button among status buttons specifically
      const allButtons = screen.getAllByTestId('button');
      const todoButton = allButtons.find(btn =>
        btn.textContent === 'To Do' && !btn.textContent.includes('Edit') && !btn.textContent.includes('Delete')
      );

      expect(todoButton).toBeInTheDocument();
      await user.click(todoButton!);

      expect(mockModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Undone?',
          content: 'This task is marked as done. Are you sure you want to change the status?',
          okText: 'Yes',
          cancelText: 'Cancel'
        })
      );
      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith(baseTodo.id, 'Todo');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper tooltip titles for action buttons', () => {
      render(<TodoItem
          todo={baseTodo}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onStatusChange={mockOnStatusChange}/>);
      const tooltips = screen.getAllByTestId('tooltip');
      const editTooltip = tooltips.find(tooltip =>
        tooltip.getAttribute('title') === 'Edit');
      const deleteTooltip = tooltips.find(tooltip =>
        tooltip.getAttribute('title') === 'Delete');
      expect(editTooltip).toBeInTheDocument();
      expect(deleteTooltip).toBeInTheDocument();
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