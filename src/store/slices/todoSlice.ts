import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ITodoItem, ICreateTodoDto, IUpdateTodoDto, TodoStatus, ITodoFilter } from '@/types';
import { todoService } from '@/services/api/todoService.ts';

export interface ITodoState {
  items: ITodoItem[];
  loading: boolean;
  error: string | null;
  filter: ITodoFilter;
  selectedTodo: ITodoItem | null;
}

const initialState: ITodoState = {
  items: [],
  loading: false,
  error: null,
  filter: {},
  selectedTodo: null,
};

export const fetchTodos = createAsyncThunk<
    ITodoItem[],
    void,
    { rejectValue: string }>(
    'todos/fetchTodos',
    async (_, { rejectWithValue }) => {
        try {
            return await todoService.getAllTodos();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch todos';
            return rejectWithValue(message);
        }
    }
);

export const fetchTodoById = createAsyncThunk<
    ITodoItem,
    string,
    { rejectValue: string }>(
        'todos/fetchTodoById',
    async (id: string, { rejectWithValue }) => {
            try {
                return await todoService.getTodoById(id);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to create todo';
                return rejectWithValue(message);
            }
    }
)

export const createTodo = createAsyncThunk<
    ITodoItem,
    ICreateTodoDto,
    { rejectValue: string }>(
    'todos/createTodo',
    async (todoData: ICreateTodoDto, { rejectWithValue }) => {
        try {
            return await todoService.createTodo(todoData);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create todo';
            return rejectWithValue(message);
        }
    }
);

export const updateTodo = createAsyncThunk<
    ITodoItem,
    IUpdateTodoDto,
    { rejectValue: string }>(
    'todos/updateTodo',
    async (todoData: IUpdateTodoDto, { rejectWithValue }) => {
        try {
            return await todoService.updateTodo(todoData);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update todo';
            return rejectWithValue(message);
        }
    }
);

export const updateTodoStatus = createAsyncThunk<
    ITodoItem,
    { id: string; status: TodoStatus },
    { rejectValue: string }>(
    'todos/updateTodoStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await todoService.updateTodoStatus(id, status);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update todo status';
            return rejectWithValue(message);
        }
    }
);

export const deleteTodo = createAsyncThunk<
    string,
    string,
    { rejectValue: string }>(
    'todos/deleteTodo',
    async (id: string, { rejectWithValue }) => {
        try {
            await todoService.deleteTodo(id);
            return id;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete todo';
            return rejectWithValue(message);
        }
    }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<ITodoFilter>) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = {};
    },
    setSelectedTodo: (state, action: PayloadAction<ITodoItem | null>) => {
      state.selectedTodo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // Fetch todos
        .addCase(fetchTodos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }));
        })
        .addCase(fetchTodos.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })

        // Create todo
        .addCase(createTodo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createTodo.fulfilled, (state, action) => {
          state.loading = false;
          const newTodo = {
            ...action.payload,
            createdAt: new Date(action.payload.createdAt),
            updatedAt: new Date(action.payload.updatedAt),
            dueDate: action.payload.dueDate ? new Date(action.payload.dueDate) : undefined
          };
          state.items.unshift(newTodo);
        })
        .addCase(createTodo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })

        // Update todo
        .addCase(updateTodo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateTodo.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = {
              ...action.payload,
              createdAt: new Date(action.payload.createdAt),
              updatedAt: new Date(action.payload.updatedAt),
              dueDate: action.payload.dueDate ? new Date(action.payload.dueDate) : undefined
            };
          }
          state.selectedTodo = null;
        })
        .addCase(updateTodo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })

        // Update todo status
        .addCase(updateTodoStatus.pending, (state) => {
          state.error = null;
        })
        .addCase(updateTodoStatus.fulfilled, (state, action) => {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = {
              ...action.payload,
              createdAt: new Date(action.payload.createdAt),
              updatedAt: new Date(action.payload.updatedAt),
              dueDate: action.payload.dueDate ? new Date(action.payload.dueDate) : undefined
            };
          }
        })
        .addCase(updateTodoStatus.rejected, (state, action) => {
          state.error = action.payload as string;
        })

        // Delete todo
        .addCase(deleteTodo.pending, (state) => {
          state.error = null;
        })
        .addCase(deleteTodo.fulfilled, (state, action) => {
          state.items = state.items.filter(item => item.id !== action.payload);
          if (state.selectedTodo?.id === action.payload) {
            state.selectedTodo = null;
          }
        })
        .addCase(deleteTodo.rejected, (state, action) => {
          state.error = action.payload as string;
        });
  },
});

export const { setFilter, clearFilter, setSelectedTodo, clearError } = todoSlice.actions;
export default todoSlice.reducer;