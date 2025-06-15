import React from 'react';
import { Modal } from 'antd';
import { Card, Typography, Tag, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ITodoItem, TodoStatus } from '@types';
import styles from './TodoItem.module.css';

const { Title, Text } = Typography;

export interface TodoItemProps {
  todo: ITodoItem;
  onEdit: (todo: ITodoItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}

const getStatusColor = (status: TodoStatus): string => {
  switch (status) {
    case 'Todo': return 'default';
    case 'InProgress': return 'processing';
    case 'Done': return 'success';
    default: return 'default';
  }
};

const getStatusText = (status: TodoStatus): string => {
  switch (status) {
    case 'Todo': return 'To Do';
    case 'InProgress': return 'In Progress';
    case 'Done': return 'Done';
    default: return status;
  }
};

const isOverdue = (dueDate?: Date, isCompleted?: boolean): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && !isCompleted;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const { id, title, description, status, dueDate, isCompleted } = todo;
  const overdue = isOverdue(dueDate, isCompleted);

const handleStatusChange = (newStatus: TodoStatus) => {
  if (status === 'Done' && newStatus !== 'Done') {
    console.log('Opening confirmation modal...');
    Modal.confirm({
      title: 'Undone?',
      content: 'This task is marked as done. Are you sure you want to change the status?',
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: () => onStatusChange(id, newStatus),
      getContainer: () => document.body,
    });
  } else {
    onStatusChange(id, newStatus);
  }
};

  // Build classes for the Card component
  const cardClasses = [
    styles.todoCard,
    isCompleted && styles.completed,
    overdue && styles.overdue
  ].filter(Boolean).join(' ');

  return (
    <Card size="small" className={cardClasses} data-testid="todo-card">

      {/* Title and action buttons */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Title
            level={5}
            data-testid="title-text"
            className={`${styles.title} ${isCompleted ? styles.completedTitle : ''}`}>
            {title}
          </Title>
        </div>
        <div className={styles.actions}>
          <Tooltip title="Edit" data-testid="edit-tooltip">
            <Button
              type="text"
              data-testid="edit-button"
              icon={<EditOutlined />}
              onClick={() => onEdit(todo)}
            />
          </Tooltip>
          <Tooltip title="Delete" data-testid="delete-tooltip">
            <Button
              type="text"
              data-testid="delete-button"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(id)}
              danger/>
          </Tooltip>
        </div>
      </div>

      {/* Due date and status tag */}
      <div className={styles.metadata}>
        {dueDate && (
          <div className={styles.dateContainer}>
            <CalendarOutlined />
            <Text
              type={overdue ? 'danger' : 'secondary'}
              className={styles.dateText}>
              {new Date(dueDate).toLocaleDateString()}
              {overdue && ' (Overdue)'}
            </Text>
          </div>
        )}
        <Tag color={getStatusColor(status)} data-testid="status-tag">{getStatusText(status)}</Tag>
      </div>

      {/* Description */}
      {description && (
        <div className={styles.descriptionContainer}>
          <Text type="secondary" className={styles.description} data-testid="description-text">
            {description}
          </Text>
        </div>
      )}

      {/* Status change buttons */}
      <div className={styles.statusButtons}>
        <Space>
          <Button
            size="small"
            data-testid="todo-button"
            type={status === 'Todo' ? 'primary' : 'default'}
            onClick={() => handleStatusChange('Todo')}>
            To Do
          </Button>
          <Button
            size="small"
            data-testid="in-progress-button"
            type={status === 'InProgress' ? 'primary' : 'default'}
            onClick={() => handleStatusChange('InProgress')}>
            In Progress
          </Button>
          <Button
            size="small"
            data-testid="done-button"
            type={status === 'Done' ? 'primary' : 'default'}
            onClick={() => handleStatusChange('Done')}>
            Done
          </Button>
        </Space>
      </div>
    </Card>
  );
};
