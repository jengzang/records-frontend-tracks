import React from 'react';
import { Skeleton } from 'antd';

/**
 * Skeleton loader for table content
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4">
      <Skeleton active paragraph={{ rows }} />
    </div>
  );
};

/**
 * Skeleton loader for map content
 */
export const MapSkeleton: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-lg">加载地图中...</div>
    </div>
  );
};

/**
 * Skeleton loader for card content
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4">
          <Skeleton active />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for chart content
 */
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <div
      className="w-full bg-gray-100 animate-pulse flex items-center justify-center rounded"
      style={{ height: `${height}px` }}
    >
      <div className="text-gray-400">加载图表中...</div>
    </div>
  );
};
