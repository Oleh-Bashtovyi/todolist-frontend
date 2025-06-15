import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button, Space, Alert } from 'antd';
import type { ICreateTodoDto, IUpdateTodoDto, ITodoItem } from '@types';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface TodoFormProps {
  initialValues?: ITodoItem;
  onSubmit: (values: ICreateTodoDto | IUpdateTodoDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  const preparedInitialValues = initialValues
    ? {
        ...initialValues,
        dueDate: initialValues?.dueDate ? dayjs(initialValues.dueDate) : undefined
      }
    : {
        title: '',
        description: '',
        dueDate: null
      };

  useEffect(() => {
    form.setFieldsValue(preparedInitialValues);
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toDate() : undefined
    };

    if (isEdit && initialValues) {
      onSubmit({ id: initialValues.id, ...formData } as IUpdateTodoDto);
    } else {
      onSubmit(formData as ICreateTodoDto);
    }
  };

  const selectedDate = Form.useWatch('dueDate', form);

  const isPastDate = selectedDate
    ? selectedDate.startOf('day').isBefore(dayjs().startOf('day'))
    : false;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={preparedInitialValues}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          { required: true, message: 'Please enter a title' },
          { min: 1, message: 'Title must not be empty' }
        ]}
      >
        <Input placeholder="Enter todo title" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea rows={4} placeholder="Enter todo description (optional)" />
      </Form.Item>

      <Form.Item label="Due Date" name="dueDate">
        <DatePicker
          style={{ width: '100%' }}
          placeholder="Select due date (optional)"
          showTime={false}
        />
      </Form.Item>

      {isPastDate && (
        <div style={{ marginBottom: 16 }}>
          <Alert
            type="warning"
            showIcon
            message="Selected due date is in the past"
            description="You are selecting a date that has already passed. Make sure this is intentional."
          />
        </div>
      )}

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
