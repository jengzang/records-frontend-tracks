import React, { useEffect } from 'react';
import { Table, Tag, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ImportTask } from '../../types/import';

const { Text } = Typography;

interface ImportTaskListProps {
  tasks: ImportTask[];
  loading?: boolean;
  onRefresh?: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

const getStatusTag = (status: ImportTask['status']) => {
  const statusConfig = {
    pending: { color: 'default', text: '等待中' },
    running: { color: 'processing', text: '运行中' },
    completed: { color: 'success', text: '已完成' },
    failed: { color: 'error', text: '失败' }
  };
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.text}</Tag>;
};

const ImportTaskList: React.FC<ImportTaskListProps> = ({ tasks, loading, onRefresh }) => {
  // 自动刷新运行中的任务
  useEffect(() => {
    const runningTasks = tasks.filter(t => t.status === 'running');

    if (runningTasks.length > 0 && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 3000); // 每3秒刷新一次

      return () => clearInterval(interval);
    }
  }, [tasks, onRefresh]);

  const columns: ColumnsType<ImportTask> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name',
      ellipsis: true,
      render: (text: string) => <Text ellipsis={{ tooltip: text }}>{text}</Text>
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 120,
      render: (size: number) => formatFileSize(size)
    },
    {
      title: '导入模式',
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (mode: string) => mode === 'append' ? '增量' : '全量'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ImportTask['status']) => getStatusTag(status)
    },
    {
      title: '统计信息',
      key: 'statistics',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>总数: {formatNumber(record.total_records)}</Text>
          <Text type="success">新增: {formatNumber(record.new_records)}</Text>
          <Text type="warning">重复: {formatNumber(record.duplicate_records)}</Text>
        </Space>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '完成时间',
      dataIndex: 'completed_at',
      key: 'completed_at',
      width: 180,
      render: (time?: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '错误信息',
      dataIndex: 'error_message',
      key: 'error_message',
      ellipsis: true,
      render: (text?: string) => text ? <Text type="danger" ellipsis={{ tooltip: text }}>{text}</Text> : '-'
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      }}
    />
  );
};

export default ImportTaskList;
