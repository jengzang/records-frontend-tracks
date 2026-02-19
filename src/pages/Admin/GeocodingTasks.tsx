import React, { useState, useEffect } from 'react';
import { Table, Button, Progress, Tag, message, Modal, Space } from 'antd';
import { PlusOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import {
  listGeocodingTasks,
  createGeocodingTask,
  cancelGeocodingTask,
  GeocodingTask,
  TaskStatus,
} from '../../services/adminService';
import { formatTimestamp, formatDuration } from '../../utils/formatters';
import { TASK_REFRESH_INTERVAL } from '../../utils/constants';

const GeocodingTasks: React.FC = () => {
  const [tasks, setTasks] = useState<GeocodingTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await listGeocodingTasks();
      setTasks(data);
    } catch (error: any) {
      message.error(error.message || '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleCreate = async () => {
    Modal.confirm({
      title: '创建地理编码任务',
      content: '确定要创建新的地理编码任务吗？这将处理所有未编码的轨迹点。',
      onOk: async () => {
        try {
          setCreating(true);
          await createGeocodingTask();
          message.success('任务创建成功');
          fetchTasks();
        } catch (error: any) {
          message.error(error.message || '创建任务失败');
        } finally {
          setCreating(false);
        }
      },
    });
  };

  // Cancel task
  const handleCancel = async (id: string) => {
    Modal.confirm({
      title: '取消任务',
      content: '确定要取消这个任务吗？',
      onOk: async () => {
        try {
          await cancelGeocodingTask(id);
          message.success('任务已取消');
          fetchTasks();
        } catch (error: any) {
          message.error(error.message || '取消任务失败');
        }
      },
    });
  };

  // Auto-refresh for running tasks
  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      const hasRunningTasks = tasks.some((t) => t.status === TaskStatus.RUNNING);
      if (hasRunningTasks) {
        fetchTasks();
      }
    }, TASK_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [tasks]);

  // Table columns
  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <span className="font-mono text-xs">{id.slice(0, 8)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TaskStatus) => {
        const colorMap = {
          [TaskStatus.PENDING]: 'default',
          [TaskStatus.RUNNING]: 'processing',
          [TaskStatus.COMPLETED]: 'success',
          [TaskStatus.FAILED]: 'error',
        };
        const labelMap = {
          [TaskStatus.PENDING]: '等待中',
          [TaskStatus.RUNNING]: '运行中',
          [TaskStatus.COMPLETED]: '已完成',
          [TaskStatus.FAILED]: '失败',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: '进度',
      key: 'progress',
      width: 200,
      render: (_: any, record: GeocodingTask) => (
        <div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.status === TaskStatus.FAILED ? 'exception' : undefined}
          />
          <div className="text-xs text-gray-500 mt-1">
            {record.processed_points} / {record.total_points} 点
            {record.status === TaskStatus.RUNNING && record.eta_seconds && (
              <span className="ml-2">
                预计剩余: {formatDuration(record.eta_seconds)}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '成功/失败',
      key: 'result',
      width: 120,
      render: (_: any, record: GeocodingTask) => (
        <div className="text-sm">
          <div className="text-green-600">成功: {record.success_count}</div>
          <div className="text-red-600">失败: {record.failed_count}</div>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time: string) => formatTimestamp(new Date(time).getTime() / 1000),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: GeocodingTask) => (
        <Space>
          {record.status === TaskStatus.RUNNING && (
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              取消
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">地理编码任务</h1>
          <p className="text-gray-600 mt-1">
            将GPS坐标转换为行政区划信息（省/市/区县/乡镇/村）
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchTasks} loading={loading}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={creating}
          >
            创建任务
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default GeocodingTasks;
