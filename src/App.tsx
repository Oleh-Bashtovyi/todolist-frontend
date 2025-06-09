import React, { useState } from 'react';
import { Button, Divider, message, Card } from 'antd';
import { TodoForm } from './components/todo/TodoForm';
import { TodoItem } from './components/todo/TodoItem';
import type {ICreateTodoDto, IUpdateTodoDto, ITodoItem, TodoStatus} from './types/todo.types.ts';

const App: React.FC = () => {
  const [todos, setTodos] = useState<ITodoItem[]>([]);
  const [editingTodo, setEditingTodo] = useState<ITodoItem | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  // Додавання або оновлення Todo
  const handleFormSubmit = (values: ICreateTodoDto | IUpdateTodoDto) => {
    if ('id' in values) {
      // Update
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === values.id
            ? { ...todo, ...values }
            : todo
        )
      );
      message.success('Todo updated!');
    } else {
      // Create
      const newTodo: ITodoItem = {
        ...values,
        id: Date.now().toString(),
        status: 'Todo',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTodos((prev) => [...prev, newTodo]);
      message.success('Todo created!');
    }
    setEditingTodo(null);
    setFormVisible(false);
  };

  // Редагування Todo
  const handleEdit = (todo: ITodoItem) => {
    setEditingTodo(todo);
    setFormVisible(true);
  };

  // Видалення Todo
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    message.success('Todo deleted!');
  };

  // Зміна статусу Todo
  const handleStatusChange = (id: string, status: TodoStatus) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, status, isCompleted: status === 'Done' }
          : todo
      )
    );
  };

  return (
    <div
      style={{
        width: '80vw',
        margin: '0 auto',
        padding: '20px',
        position: 'relative',
      }}
    >
      <Card style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
        <Divider orientation="left">Todo List</Divider>
        <Button
          type="primary"
          onClick={() => {
            setEditingTodo(null);
            setFormVisible(true);
          }}
        >
          Add Todo
        </Button>
        <div style={{ marginTop: 20 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </Card>

      {/* Floating form at the bottom */}
      {formVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80vw',
            maxWidth: '600px',
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          <TodoForm
            initialValues={editingTodo || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setEditingTodo(null);
              setFormVisible(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
