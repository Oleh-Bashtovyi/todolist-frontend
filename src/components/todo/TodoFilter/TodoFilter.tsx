import React from 'react';
import { Card, Select, Input, Checkbox, Space, Typography } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ITodoFilter, TodoStatus } from "@types";
import {TodoStatusEnum} from "@types";

const { Title } = Typography;
const { Option } = Select;

export interface TodoFilterProps {
  filters: ITodoFilter;
  onFilterChange: (filters: ITodoFilter) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filters,
  onFilterChange
}) => {
  const handleStatusChange = (status: TodoStatus | undefined) => {
    onFilterChange({
      ...filters,
      status
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value || undefined
    });
  };

  const handleOverdueChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      overdue: checked ? true : undefined
    });
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilterOutlined />
          <Title level={5} style={{ margin: 0 }}>
            Filters
          </Title>
        </div>

        <Space wrap>
          <Input
            placeholder="Search todos..."
            data-testid="text-search-input"
            prefix={<SearchOutlined />}
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
            style={{ width: 200 }}
            allowClear/>

          <Select
            placeholder="Filter by status"
            data-testid="status-search-input"
            style={{ width: 150 }}
            value={filters.status}
            onChange={handleStatusChange}
            allowClear>
            <Option value={TodoStatusEnum.Todo}>To Do</Option>
            <Option value={TodoStatusEnum.InProgress}>In Progress</Option>
            <Option value={TodoStatusEnum.Done}>Done</Option>
          </Select>

          <Checkbox
            checked={filters.overdue || false}
            data-testid="overdue-search-input"
            onChange={(e) => handleOverdueChange(e.target.checked)}>
            Show overdue only
          </Checkbox>
        </Space>
      </Space>
    </Card>
  );
};