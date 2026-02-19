import React, { useState, useEffect } from 'react';
import { Select, Card, message, Space } from 'antd';
import { getStayRankings, StayRanking } from '../../services/statsService';
import RankingTable from '../../components/Statistics/RankingTable';
import PieChart from '../../components/Charts/PieChart';
import { formatDuration } from '../../utils/formatters';
import type { ColumnsType } from 'antd/es/table';

const StayRankings: React.FC = () => {
  const [data, setData] = useState<StayRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statType, setStatType] = useState<string>('PROVINCE');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<string>('count');

  const fetchData = async () => {
    try {
      setLoading(true);
      const rankings = await getStayRankings({
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

  const columns: ColumnsType<StayRanking> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: '停留次数',
      dataIndex: 'stay_count',
      key: 'stay_count',
      width: 120,
      sorter: (a, b) => a.stay_count - b.stay_count,
    },
    {
      title: '总时长',
      dataIndex: 'total_duration_seconds',
      key: 'total_duration_seconds',
      width: 150,
      sorter: (a, b) => a.total_duration_seconds - b.total_duration_seconds,
      render: (val: number) => formatDuration(val),
    },
    {
      title: '平均时长',
      dataIndex: 'avg_duration_seconds',
      key: 'avg_duration_seconds',
      width: 150,
      sorter: (a, b) => a.avg_duration_seconds - b.avg_duration_seconds,
      render: (val: number) => formatDuration(val),
    },
  ];

  // Prepare pie chart data (top 10)
  const pieData = data.slice(0, 10).map((item) => ({
    name: item.name,
    value: orderBy === 'count' ? item.stay_count : item.total_duration_seconds / 3600, // hours
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">停留排名</h1>
        <p className="text-gray-600">按地理区域或类别统计停留分布</p>
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
                { label: '类别', value: 'CATEGORY' },
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
                { label: '次数', value: 'count' },
                { label: '总时长', value: 'duration' },
              ]}
            />
          </div>
        </Space>
      </Card>

      {/* Chart */}
      {pieData.length > 0 && (
        <Card className="mb-4" title="Top 10 分布">
          <PieChart
            data={pieData}
            nameField="name"
            valueField="value"
            height={400}
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

export default StayRankings;
