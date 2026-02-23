import React from 'react';
import { Table, Button, List, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface RankingTableProps {
  data: any[];
  columns: ColumnsType<any>;
  loading?: boolean;
  pagination?: TablePaginationConfig | false;
  onExport?: () => void;
}

const RankingTable: React.FC<RankingTableProps> = ({
  data,
  columns,
  loading = false,
  pagination = { pageSize: 20 },
  onExport,
}) => {
  const isMobile = useIsMobile();

  // Add rank column if not present
  const columnsWithRank: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      fixed: 'left',
      render: (_: any, __: any, index: number) => {
        const rank = index + 1;
        let className = '';
        if (rank === 1) className = 'text-yellow-600 font-bold text-lg';
        else if (rank === 2) className = 'text-gray-500 font-bold text-lg';
        else if (rank === 3) className = 'text-orange-600 font-bold text-lg';
        return <span className={className}>{rank}</span>;
      },
    },
    ...columns,
  ];

  // Mobile card view
  if (isMobile) {
    return (
      <div>
        {onExport && (
          <div className="mb-4 flex justify-end">
            <Button icon={<DownloadOutlined />} onClick={onExport} size="small">
              导出
            </Button>
          </div>
        )}
        <List
          loading={loading}
          dataSource={data}
          pagination={pagination ? { ...(pagination as any), simple: true } : false}
          renderItem={(item, index) => {
            const rank = index + 1;
            let bgColor = '';
            if (rank === 1) bgColor = 'bg-yellow-50';
            else if (rank === 2) bgColor = 'bg-gray-50';
            else if (rank === 3) bgColor = 'bg-orange-50';

            return (
              <Card className={`mb-2 ${bgColor}`} size="small">
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-gray-400 min-w-[40px]">
                    {rank}
                  </div>
                  <div className="flex-1">
                    {columns.map((col: any) => (
                      <div key={col.key} className="mb-1">
                        <span className="text-gray-500 text-sm">{col.title}: </span>
                        <span className="font-medium">
                          {col.render ? col.render(item[col.dataIndex], item, index) : item[col.dataIndex]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          }}
        />
      </div>
    );
  }

  // Desktop table view
  return (
    <div>
      {onExport && (
        <div className="mb-4 flex justify-end">
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            导出CSV
          </Button>
        </div>
      )}
      <Table
        columns={columnsWithRank}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        rowKey={(_record, index) => index?.toString() || '0'}
        scroll={{ x: 'max-content' }}
        rowClassName={(_, index) => {
          if (index === 0) return 'bg-yellow-50';
          if (index === 1) return 'bg-gray-50';
          if (index === 2) return 'bg-orange-50';
          return '';
        }}
      />
    </div>
  );
};

export default RankingTable;
