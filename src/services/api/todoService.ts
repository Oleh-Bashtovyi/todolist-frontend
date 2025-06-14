import type { ITodoItem, ICreateTodoDto, IUpdateTodoDto, TodoStatus } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TodoService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('Fetching from url: ' + url.toString());
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllTodos(): Promise<ITodoItem[]> {
    return this.request<ITodoItem[]>('/todos');
  }

  async getTodoById(id: string): Promise<ITodoItem> {
    return this.request<ITodoItem>(`/todos/${id}`);
  }

  async createTodo(todoData: ICreateTodoDto): Promise<ITodoItem> {
    return this.request<ITodoItem>('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(todoData: IUpdateTodoDto): Promise<ITodoItem> {
    return this.request<ITodoItem>('/todos', {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<ITodoItem> {
    return this.request<ITodoItem>(`/todos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const todoService = new TodoService();
