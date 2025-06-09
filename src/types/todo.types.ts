export const TodoStatusEnum = {
    Todo: 'Todo',
    InProgress: 'InProgress',
    Done: 'Done',
} as const;

export type TodoStatus = (typeof TodoStatusEnum)[keyof typeof TodoStatusEnum];

export interface ITodoItem {
    id: string;
    title: string;
    description?: string;
    status: TodoStatus;
    dueDate?: Date; 
    isCompleted: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date; 
    updatedAt: Date; 
}

export interface ICreateTodoDto {
    title: string;
    description?: string;
    dueDate?: Date;
}

export interface IUpdateTodoDto {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
}

export interface IUpdateTodoStatusRequest {
    id: string;
    status: TodoStatus;
}

export interface ITodoFilter {
    status?: TodoStatus;
    overdue?: boolean;
    searchTerm?: string;
}

export interface ITodoState {
    items: ITodoItem[];
    loading: boolean;
    error: string | null;
    filter: TodoStatus;
    selectedTodo: ITodoItem | null;
}