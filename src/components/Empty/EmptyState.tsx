import React from 'react';
import { Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
}

/**
 * Empty state component with optional action button
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description,
  actionText,
  actionPath,
  onAction,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <p className="text-lg font-medium text-gray-700">{title}</p>
            {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
          </div>
        }
      >
        {(actionText || actionPath) && (
          <Button type="primary" onClick={handleAction}>
            {actionText || '开始导入'}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;
