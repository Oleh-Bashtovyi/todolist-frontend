import React from 'react';
import { Empty, Spin } from 'antd';
import { TodoItem } from '@todos/TodoItem';
import type {ITodoItem, TodoStatus} from '@types';

interface TodoListProps {
  todos: ITodoItem[];
  loading: boolean;
  onEdit: (todo: ITodoItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <Empty
        description="No todos found"
        style={{ padding: '50px 0' }}
      />
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};