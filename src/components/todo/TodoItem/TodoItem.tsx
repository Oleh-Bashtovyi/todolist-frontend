import React from 'react';
import { Card, Typography, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import type {ITodoItem, TodoStatus} from '../../../types/todo.types.ts';

const { Title, Text } = Typography;

interface TodoItemProps {
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

const isOverdue = (dueDate?: Date, isCompleted?:boolean): boolean => {
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
    onStatusChange(id, newStatus);
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        opacity: isCompleted ? 0.7 : 1,
        borderLeft: overdue ? '4px solid #ff4d4f' : undefined
      }}
      actions={[
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(todo)}
        />,
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(id)}
          danger
        />
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0, textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {title}
          </Title>
          {description && (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              {description}
            </Text>
          )}
          {dueDate && (
            <div style={{ marginTop: 8 }}>
              <CalendarOutlined />
              <Text style={{ marginLeft: 8 }} type={overdue ? 'danger' : 'secondary'}>
                {new Date(dueDate).toLocaleDateString()}
                {overdue && ' (Overdue)'}
              </Text>
            </div>
          )}
        </div>
        <div>
          <Space direction="vertical" align="end">
            <Tag color={getStatusColor(status)}>
              {getStatusText(status)}
            </Tag>
            <Space>
              {status !== 'Todo' && (
                <Button size="small" onClick={() => handleStatusChange('Todo')}>
                  To Do
                </Button>
              )}
              {status !== 'InProgress' && (
                <Button size="small" onClick={() => handleStatusChange('InProgress')}>
                  In Progress
                </Button>
              )}
              {status !== 'Done' && (
                <Button size="small" type="primary" onClick={() => handleStatusChange('Done')}>
                  Done
                </Button>
              )}
            </Space>
          </Space>
        </div>
      </div>
    </Card>
  );
};