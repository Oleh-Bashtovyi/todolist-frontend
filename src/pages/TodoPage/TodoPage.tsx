import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Button, Modal, Typography, notification, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TodoList } from '@todos/TodoList';
import { TodoForm } from '@todos/TodoForm';
import { TodoFilter } from '@components/todo';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  setFilter,
  setSelectedTodo,
  clearError, type RootState
} from '@/store';
import type { ITodoItem, ICreateTodoDto, IUpdateTodoDto, TodoStatus, ITodoFilter } from '@types';

const { Content } = Layout;
const { Title } = Typography;

export const TodoPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filter, selectedTodo } = useSelector((state: RootState) => state.todos);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    dispatch(fetchTodos() as any);
  }, [dispatch]);

  useEffect(() => {
    console.log('Error:', error);
    if (error) {
      notification.error({
        message: 'Error',
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredTodos = useMemo(() => {
    let filtered = items;

    if (filter.status) {
      filtered = filtered.filter(todo => todo.status === filter.status);
    }

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.overdue) {
      const curDate = new Date();
      filtered = filtered.filter(todo => {
        if (!todo.dueDate || todo.status === 'Done') return false;
        return todo.dueDate < curDate;
      });
    }

    return filtered;
  }, [items, filter]);

  const handleCreateTodo = () => {
    setModalMode('create');
    setIsModalVisible(true);
    dispatch(setSelectedTodo(null));
  };

  const handleEditTodo = (todo: ITodoItem) => {
    setModalMode('edit');
    setIsModalVisible(true);
    dispatch(setSelectedTodo(todo));
  };

  const handleDeleteTodo = (id: string) => {
    console.log('Trying to delete');
    Modal.confirm({
      title: 'Delete Todo',
      content: 'Are you sure you want to delete this todo?',
      onOk: () => {
        dispatch(deleteTodo(id) as any);
      },
    });
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    dispatch(updateTodoStatus({ id, status }) as any);
  };

  const handleSubmit = (values: ICreateTodoDto | IUpdateTodoDto) => {
    if (modalMode === 'create') {
      dispatch(createTodo(values as ICreateTodoDto) as any).then(() => {
        setIsModalVisible(false);
        notification.success({
          message: 'Success',
          description: 'Todo created successfully',
        });
      });
    } else {
      dispatch(updateTodo(values as IUpdateTodoDto) as any).then(() => {
        setIsModalVisible(false);
        notification.success({
          message: 'Success',
          description: 'Todo updated successfully',
        });
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch(setSelectedTodo(null));
  };

  const handleFilterChange = (newFilter: ITodoFilter) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Content style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2} style={{ margin: 0 }}>
                Todo List
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateTodo}
                size="large"
              >
                Add Todo
              </Button>
            </div>
          </Col>

          <Col span={24}>
            <TodoFilter
              filters={filter}
              onFilterChange={handleFilterChange}
            />
          </Col>

          <Col span={24}>
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onStatusChange={handleStatusChange}
            />
          </Col>
        </Row>

        <Modal
          title={modalMode === 'create' ? 'Create Todo' : 'Edit Todo'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <TodoForm
            initialValues={selectedTodo || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Modal>
      </Content>
    </Layout>
  );
};