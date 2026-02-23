import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Progress, Statistic, Row, Col, Divider, Alert } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import FileUpload from '../../components/Admin/FileUpload';
import ImportTaskList from '../../components/Admin/ImportTaskList';
import { ImportTask } from '../../types/import';
import { getImportTask } from '../../services/importService';

const { Title, Text } = Typography;

const DataImport: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<ImportTask | null>(null);
  const [tasks, setTasks] = useState<ImportTask[]>([]);
  const [loading, setLoading] = useState(false);

  // 处理上传成功
  const handleUploadSuccess = async (taskId: number) => {
    try {
      const task = await getImportTask(taskId);
      setCurrentTask(task);
      // 滚动到当前任务状态区域
      setTimeout(() => {
        document.getElementById('current-task')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Failed to fetch task:', error);
    }
  };

  // 自动刷新当前任务
  useEffect(() => {
    if (currentTask && currentTask.status === 'running') {
      const interval = setInterval(async () => {
        try {
          const updated = await getImportTask(currentTask.id);
          setCurrentTask(updated);
          if (updated.status !== 'running') {
            clearInterval(interval);
            // 刷新任务列表
            loadTasks();
          }
        } catch (error) {
          console.error('Failed to refresh task:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentTask]);

  // 加载任务列表
  const loadTasks = async () => {
    setLoading(true);
    try {
      // TODO: 实现获取任务列表的API
      // const response = await getImportTasks();
      // setTasks(response);
      setTasks([]);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 计算进度百分比
  const getProgress = (task: ImportTask): number => {
    if (task.status === 'completed') return 100;
    if (task.status === 'failed') return 0;
    if (task.total_records === 0) return 0;
    return Math.round((task.new_records / task.total_records) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <Title level={2}>数据导入管理</Title>
        <Text type="secondary">上传GPS轨迹数据文件，支持增量导入和全量替换</Text>
      </div>

      {/* 上传配置区域 */}
      <Card title="上传数据文件" bordered={false}>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </Card>

      {/* 当前任务状态 */}
      {currentTask && (
        <Card id="current-task" title="当前任务状态" bordered={false}>
          <Space direction="vertical" size="large" className="w-full">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="任务ID"
                  value={currentTask.id}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="文件名"
                  value={currentTask.file_name}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="导入模式"
                  value={currentTask.mode === 'append' ? '增量导入' : '全量替换'}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="状态"
                  value={
                    currentTask.status === 'completed' ? '已完成' :
                    currentTask.status === 'failed' ? '失败' :
                    currentTask.status === 'running' ? '运行中' : '等待中'
                  }
                  valueStyle={{
                    color: currentTask.status === 'completed' ? '#3f8600' :
                           currentTask.status === 'failed' ? '#cf1322' : '#1890ff'
                  }}
                  prefix={
                    currentTask.status === 'completed' ? <CheckCircleOutlined /> :
                    currentTask.status === 'failed' ? <CloseCircleOutlined /> :
                    <ClockCircleOutlined />
                  }
                />
              </Col>
            </Row>

            {currentTask.status === 'running' && (
              <Progress percent={getProgress(currentTask)} status="active" />
            )}

            <Divider />

            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总记录数"
                  value={currentTask.total_records}
                  formatter={(value) => value.toLocaleString('zh-CN')}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="新增记录"
                  value={currentTask.new_records}
                  formatter={(value) => value.toLocaleString('zh-CN')}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="重复记录"
                  value={currentTask.duplicate_records}
                  formatter={(value) => value.toLocaleString('zh-CN')}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>

            {currentTask.error_message && (
              <Alert
                message="错误信息"
                description={currentTask.error_message}
                type="error"
                showIcon
              />
            )}
          </Space>
        </Card>
      )}

      {/* 历史任务列表 */}
      <Card title="历史任务列表" bordered={false}>
        <ImportTaskList
          tasks={tasks}
          loading={loading}
          onRefresh={loadTasks}
        />
      </Card>
    </div>
  );
};

export default DataImport;
