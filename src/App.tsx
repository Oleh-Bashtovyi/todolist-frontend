import './App.css';
import { TodoItem } from './components/todo/TodoItem/TodoItem.tsx';
import type {ITodoItem} from "./types/todo.types.ts";

const testTodo: ITodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Це тестова задача',
    status: 'Todo',
    dueDate: new Date(),
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};

function App() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}
      >
        <TodoItem
          todo={testTodo}
          onEdit={(todo) => console.log('Edit', todo)}
          onDelete={(id) => console.log('Delete', id)}
          onStatusChange={(id, status) => console.log('Status Change', id, status)}
        />
      </div>
    </>
  );
}

export default App;
