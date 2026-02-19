import React from 'react';
import { Progress, Tag, Alert } from 'antd';
import { TaskStatus as TaskStatusEnum } from '../../services/adminService';
import { formatDuration } from '../../utils/formatters';

interface TaskStatusProps {
  status: TaskStatusEnum;
  progress?: number;
  processedCount?: number;
  totalCount?: number;
  etaSeconds?: number;
  errorMessage?: string;
  resultSummary?: string;
}

const TaskStatus: React.FC<TaskStatusProps> = ({
  status,
  progress = 0,
  processedCount,
  totalCount,
  etaSeconds,
  errorMessage,
  resultSummary,
}) => {
  const getStatusTag = () => {
    const colorMap = {
      [TaskStatusEnum.PENDING]: 'default',
      [TaskStatusEnum.RUNNING]: 'processing',
      [TaskStatusEnum.COMPLETED]: 'success',
      [TaskStatusEnum.FAILED]: 'error',
    };
    const labelMap = {
      [TaskStatusEnum.PENDING]: '等待中',
      [TaskStatusEnum.RUNNING]: '运行中',
      [TaskStatusEnum.COMPLETED]: '已完成',
      [TaskStatusEnum.FAILED]: '失败',
    };
    return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
  };

  return (
    <div className="space-y-2">
      {/* Status Badge */}
      <div>{getStatusTag()}</div>

      {/* Progress Bar */}
      {(status === TaskStatusEnum.RUNNING || status === TaskStatusEnum.COMPLETED) && (
        <div>
          <Progress
            percent={progress}
            size="small"
            status={status === TaskStatusEnum.COMPLETED ? undefined : 'active'}
          />
          {processedCount !== undefined && totalCount !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              {processedCount} / {totalCount}
              {status === TaskStatusEnum.RUNNING && etaSeconds && (
                <span className="ml-2">
                  预计剩余: {formatDuration(etaSeconds)}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {status === TaskStatusEnum.FAILED && errorMessage && (
        <Alert message="错误" description={errorMessage} type="error" showIcon />
      )}

      {/* Result Summary */}
      {status === TaskStatusEnum.COMPLETED && resultSummary && (
        <Alert message="完成" description={resultSummary} type="success" showIcon />
      )}
    </div>
  );
};

export default TaskStatus;
