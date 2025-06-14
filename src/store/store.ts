import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
            'todos/fetchTodos/fulfilled',
            'todos/createTodo/fulfilled',
            'todos/updateTodo/fulfilled'],
        ignoredPaths: [
            'todos.items.createdAt',
            'todos.items.updatedAt',
            'todos.items.dueDate',
            'todos.selectedTodo.createdAt',
            'todos.selectedTodo.updatedAt',
            'todos.selectedTodo.dueDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;