import React, { useState, useEffect } from 'react';
import { Select, Card, message, Space, Button, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { getFootprintRankings, FootprintRanking } from '../../services/statsService';
import { exportFootprintCSV, exportFootprintJSON } from '../../services/exportService';
import RankingTable from '../../components/Statistics/RankingTable';
import BarChart from '../../components/Charts/BarChart';
import { formatDistance, formatDuration } from '../../utils/formatters';
import type { ColumnsType } from 'antd/es/table';

const FootprintRankings: React.FC = () => {
  const [data, setData] = useState<FootprintRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statType, setStatType] = useState<string>('PROVINCE');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<string>('points');

  const fetchData = async () => {
    try {
      setLoading(true);
      const rankings = await getFootprintRankings({
        statType,
        timeRange,
        orderBy,
      });
      setData(rankings.items || []);
    } catch (error: any) {
      message.error(error.message || '获取排名数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statType, timeRange, orderBy]);

  const columns: ColumnsType<FootprintRanking> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: '点数',
      dataIndex: 'point_count',
      key: 'point_count',
      width: 120,
      sorter: (a, b) => a.point_count - b.point_count,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '访问次数',
      dataIndex: 'visit_count',
      key: 'visit_count',
      width: 120,
      sorter: (a, b) => a.visit_count - b.visit_count,
    },
    {
      title: '总时长',
      dataIndex: 'duration_seconds',
      key: 'duration_seconds',
      width: 150,
      sorter: (a, b) => a.duration_seconds - b.duration_seconds,
      render: (val: number) => formatDuration(val),
    },
    {
      title: '总距离',
      dataIndex: 'distance_meters',
      key: 'distance_meters',
      width: 150,
      sorter: (a, b) => a.distance_meters - b.distance_meters,
      render: (val: number) => formatDistance(val),
    },
  ];

  // Prepare chart data (top 10)
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.name,
    value: orderBy === 'points' ? item.point_count :
           orderBy === 'visits' ? item.visit_count :
           orderBy === 'duration' ? item.duration_seconds / 3600 : // hours
           item.distance_meters / 1000, // km
  }));

  // Export menu items
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: '导出为 CSV',
      onClick: () => exportFootprintCSV({ statType, timeRange, orderBy }),
    },
    {
      key: 'json',
      label: '导出为 JSON',
      onClick: () => exportFootprintJSON({ statType, timeRange, orderBy }),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">足迹排名</h1>
          <p className="text-gray-600">按地理区域统计轨迹点分布</p>
        </div>
        <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
          <Button icon={<DownloadOutlined />}>导出数据</Button>
        </Dropdown>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Space size="large">
          <div>
            <span className="mr-2 font-medium">统计类型:</span>
            <Select
              value={statType}
              onChange={setStatType}
              style={{ width: 120 }}
              options={[
                { label: '省级', value: 'PROVINCE' },
                { label: '市级', value: 'CITY' },
                { label: '区县级', value: 'COUNTY' },
                { label: '乡镇级', value: 'TOWN' },
                { label: '网格', value: 'GRID' },
              ]}
            />
          </div>
          <div>
            <span className="mr-2 font-medium">时间范围:</span>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
              options={[
                { label: '全部', value: 'all' },
                { label: '今年', value: 'year' },
                { label: '本月', value: 'month' },
              ]}
            />
          </div>
          <div>
            <span className="mr-2 font-medium">排序依据:</span>
            <Select
              value={orderBy}
              onChange={setOrderBy}
              style={{ width: 120 }}
              options={[
                { label: '点数', value: 'points' },
                { label: '访问次数', value: 'visits' },
                { label: '时长', value: 'duration' },
                { label: '距离', value: 'distance' },
              ]}
            />
          </div>
        </Space>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="mb-4" title="Top 10">
          <BarChart
            data={chartData}
            xField="name"
            yField="value"
            height={300}
          />
        </Card>
      )}

      {/* Table */}
      <Card>
        <RankingTable
          data={data}
          columns={columns}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default FootprintRankings;
