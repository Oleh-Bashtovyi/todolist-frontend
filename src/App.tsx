import './App.css';
import { TodoList } from './components/todo/TodoList/TodoList';
import type { ITodoItem, TodoStatus } from './types/todo.types';

const todos: ITodoItem[] = [
  {
    id: '1',
    title: 'Test Todo 1',
    description: 'Це тестова задача 1',
    status: 'Todo' as TodoStatus,
    dueDate: new Date(),
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Test Todo 2',
    description: 'Це тестова задача 2',
    status: 'InProgress' as TodoStatus,
    dueDate: new Date(),
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Test Todo 3',
    description: 'Це тестова задача 3',
    status: 'Done' as TodoStatus,
    dueDate: new Date(),
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const handleEdit = (todo: ITodoItem) => console.log('Edit', todo);
  const handleDelete = (id: string) => console.log('Delete', id);
  const handleStatusChange = (id: string, status: TodoStatus) => console.log('Status Change', id, status);

  return (
    <div
      style={{
        width: '80vw',
        margin: '20px auto',
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <TodoList
        todos={todos}
        loading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default App;
