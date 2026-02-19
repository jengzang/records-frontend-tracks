import React, { useState, useEffect } from 'react';
import { Table, Button, Progress, Tag, message, Modal, Space } from 'antd';
import { PlayCircleOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {
  listAnalysisTasks,
  triggerAnalysisChain,
  AnalysisTask,
  TaskStatus,
} from '../../services/adminService';
import { formatTimestamp, formatDuration } from '../../utils/formatters';
import { TASK_REFRESH_INTERVAL } from '../../utils/constants';

const AnalysisTasks: React.FC = () => {
  const [tasks, setTasks] = useState<AnalysisTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await listAnalysisTasks();
      setTasks(data);
    } catch (error: any) {
      message.error(error.message || '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  // Trigger analysis chain
  const handleTrigger = async (mode: 'incremental' | 'full') => {
    const modeLabel = mode === 'incremental' ? '增量分析' : '全量重算';
    Modal.confirm({
      title: `触发${modeLabel}`,
      content: `确定要触发${modeLabel}吗？这将执行所有已实现的分析技能。`,
      onOk: async () => {
        try {
          setTriggering(true);
          await triggerAnalysisChain(mode);
          message.success(`${modeLabel}任务已创建`);
          fetchTasks();
        } catch (error: any) {
          message.error(error.message || '触发任务失败');
        } finally {
          setTriggering(false);
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
      title: '技能名称',
      dataIndex: 'skill_name',
      key: 'skill_name',
      width: 200,
      render: (name: string) => <span className="font-semibold">{name}</span>,
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
      render: (_: any, record: AnalysisTask) => (
        <div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.status === TaskStatus.FAILED ? 'exception' : undefined}
          />
          <div className="text-xs text-gray-500 mt-1">
            {record.processed_items} / {record.total_items} 项
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
      title: '结果摘要',
      dataIndex: 'result_summary',
      key: 'result_summary',
      ellipsis: true,
      render: (summary: string) => summary || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time: string) => formatTimestamp(new Date(time).getTime() / 1000),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">数据分析任务</h1>
          <p className="text-gray-600 mt-1">
            执行轨迹分析技能，包括异常检测、交通模式识别、停留检测等
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchTasks} loading={loading}>
            刷新
          </Button>
          <Button
            type="default"
            icon={<PlayCircleOutlined />}
            onClick={() => handleTrigger('incremental')}
            loading={triggering}
          >
            增量分析
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => handleTrigger('full')}
            loading={triggering}
            danger
          >
            全量重算
          </Button>
        </Space>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">分析技能说明</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>增量分析</strong>: 只处理新增或修改的数据，速度快</li>
          <li>• <strong>全量重算</strong>: 重新计算所有数据，确保一致性，耗时较长</li>
          <li>• 当前已实现15个分析技能（50%完成度）</li>
          <li>• 任务按依赖关系自动排序执行（DAG）</li>
        </ul>
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

export default AnalysisTasks;
