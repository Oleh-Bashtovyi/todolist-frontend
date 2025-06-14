import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoList } from './TodoList';
import type { ITodoItem, TodoStatus } from '@types';

// Mock the TodoItem component
jest.mock('../TodoItem', () => ({
  TodoItem: ({ todo, onEdit, onDelete, onStatusChange }: any) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.title}</span>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
      <button onClick={() => onStatusChange(todo.id, 'Done')}>Change Status</button>
    </div>
  ),
}));

// Mock Ant Design components
jest.mock('antd', () => ({
  Empty: ({ description, ...props }: any) => (
    <div data-testid="empty-component" {...props}>
      {description}
    </div>
  ),
  Spin: ({ size, ...props }: any) => (
    <div data-testid="spin-component" data-size={size} {...props}>
      Loading...
    </div>
  ),
}));

describe('TodoList Component', () => {
  const mockTodos: ITodoItem[] = [
    {
      id: '1',
      title: 'First Todo',
      description: 'First description',
      status: 'Todo' as TodoStatus,
      dueDate: new Date('2024-12-31'),
      isCompleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Second Todo',
      description: 'Second description',
      status: 'InProgress' as TodoStatus,
      dueDate: new Date('2024-12-25'),
      isCompleted: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      title: 'Third Todo',
      status: 'Done' as TodoStatus,
      isCompleted: true,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  const mockProps = {
    todos: mockTodos,
    loading: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner when loading is true', () => {
      render(<TodoList {...mockProps} loading={true} />);

      const spinner = screen.getByTestId('spin-component');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-size', 'large');
    });

    it('should center the loading spinner', () => {
      render(<TodoList {...mockProps} loading={true} />);

      const spinnerContainer = screen.getByTestId('spin-component').parentElement;
      expect(spinnerContainer).toHaveStyle({
        textAlign: 'center',
        padding: '50px 0',
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no todos are provided', () => {
      render(<TodoList {...mockProps} todos={[]} />);

      const emptyComponent = screen.getByTestId('empty-component');
      expect(emptyComponent).toBeInTheDocument();
      expect(emptyComponent).toHaveTextContent('No todos found');
    });

    it('should style empty state correctly', () => {
      render(<TodoList {...mockProps} todos={[]} />);

      const emptyComponent = screen.getByTestId('empty-component');
      expect(emptyComponent).toHaveStyle({
        padding: '50px 0',
      });
    });
  });

  describe('Todos Rendering', () => {
    it('should render all todos when provided', () => {
      render(<TodoList {...mockProps} />);

      mockTodos.forEach((todo) => {
        expect(screen.getByTestId(`todo-item-${todo.id}`)).toBeInTheDocument();
        expect(screen.getByText(todo.title)).toBeInTheDocument();
      });
    });

    it('should render todos in the correct order', () => {
      render(<TodoList {...mockProps} />);

      const todoItems = screen.getAllByTestId(/^todo-item-/);
      expect(todoItems).toHaveLength(3);

      expect(todoItems[0]).toHaveAttribute('data-testid', 'todo-item-1');
      expect(todoItems[1]).toHaveAttribute('data-testid', 'todo-item-2');
      expect(todoItems[2]).toHaveAttribute('data-testid', 'todo-item-3');
    });

    it('should pass correct props to TodoItem components', () => {
      render(<TodoList {...mockProps} />);

      // Check if TodoItem receives the correct todo data
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('Second Todo')).toBeInTheDocument();
      expect(screen.getByText('Third Todo')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('should call onEdit when edit button is clicked', () => {
      render(<TodoList {...mockProps} />);

      const editButtons = screen.getAllByText('Edit');
      editButtons[0].click();

      expect(mockProps.onEdit).toHaveBeenCalledWith(mockTodos[0]);
      expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is clicked', () => {
      render(<TodoList {...mockProps} />);

      const deleteButtons = screen.getAllByText('Delete');
      deleteButtons[1].click();

      expect(mockProps.onDelete).toHaveBeenCalledWith('2');
      expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onStatusChange when status change button is clicked', () => {
      render(<TodoList {...mockProps} />);

      const statusButtons = screen.getAllByText('Change Status');
      statusButtons[2].click();

      expect(mockProps.onStatusChange).toHaveBeenCalledWith('3', 'Done');
      expect(mockProps.onStatusChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render todos when loading', () => {
      render(<TodoList {...mockProps} loading={true} />);

      expect(screen.queryByTestId(/^todo-item-/)).not.toBeInTheDocument();
      expect(screen.queryByTestId('empty-component')).not.toBeInTheDocument();
    });

    it('should not render empty state when todos are provided', () => {
      render(<TodoList {...mockProps} />);

      expect(screen.queryByTestId('empty-component')).not.toBeInTheDocument();
    });

    it('should not render loading spinner when not loading', () => {
      render(<TodoList {...mockProps} />);

      expect(screen.queryByTestId('spin-component')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single todo item', () => {
      const singleTodo = [mockTodos[0]];
      render(<TodoList {...mockProps} todos={singleTodo} />);

      expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^todo-item-/)).toHaveLength(1);
    });

    it('should handle todos without optional fields', () => {
      const minimalTodo: ITodoItem = {
        id: '4',
        title: 'Minimal Todo',
        status: 'Todo' as TodoStatus,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      render(<TodoList {...mockProps} todos={[minimalTodo]} />);

      expect(screen.getByTestId('todo-item-4')).toBeInTheDocument();
      expect(screen.getByText('Minimal Todo')).toBeInTheDocument();
    });

    it('should handle loading and empty todos simultaneously', () => {
      render(<TodoList {...mockProps} todos={[]} loading={true} />);

      // Loading should take precedence
      expect(screen.getByTestId('spin-component')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-component')).not.toBeInTheDocument();
    });
  });
});