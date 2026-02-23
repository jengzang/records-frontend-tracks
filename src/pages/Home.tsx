import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, message, Timeline, Tag } from 'antd';
import {
  EnvironmentOutlined,
  RiseOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getFootprintRankings, getStayRankings } from '../services/statsService';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { formatDuration } from '../utils/formatters';

interface SummaryStats {
  totalPoints: number;
  totalDistance: number;
  provinceCount: number;
  cityCount: number;
  stayCount: number;
  totalStayDuration: number;
}

interface RecentTask {
  id: number;
  skill_name: string;
  status: string;
  created_at: number;
  result_summary?: string;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats>({
    totalPoints: 0,
    totalDistance: 0,
    provinceCount: 0,
    cityCount: 0,
    stayCount: 0,
    totalStayDuration: 0,
  });
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryStats = async () => {
      try {
        setLoading(true);

        // Fetch province rankings to get summary stats
        const provinceData = await getFootprintRankings({
          statType: 'PROVINCE',
          timeRange: 'all',
          orderBy: 'points',
        });

        const cityData = await getFootprintRankings({
          statType: 'CITY',
          timeRange: 'all',
          orderBy: 'points',
        });

        // Fetch stay statistics
        const stayData = await getStayRankings({
          statType: 'CITY',
          timeRange: 'all',
          orderBy: 'count',
        });

        // Fetch recent analysis tasks
        try {
          const tasksResponse = await api.get('/admin/analysis/tasks', {
            params: { limit: 5, offset: 0 },
          });
          setRecentTasks(tasksResponse.items || []);
        } catch (error) {
          console.error('Failed to fetch recent tasks:', error);
        }

        // Calculate totals
        const totalPoints = provinceData.items?.reduce((sum: number, item: any) => sum + item.point_count, 0) || 0;
        const totalDistance = provinceData.items?.reduce((sum: number, item: any) => sum + item.distance_meters, 0) || 0;
        const provinceCount = provinceData.items?.length || 0;
        const cityCount = cityData.items?.length || 0;
        const stayCount = stayData.items?.reduce((sum: number, item: any) => sum + item.stay_count, 0) || 0;
        const totalStayDuration = stayData.items?.reduce((sum: number, item: any) => sum + item.total_duration_seconds, 0) || 0;

        setStats({
          totalPoints,
          totalDistance,
          provinceCount,
          cityCount,
          stayCount,
          totalStayDuration,
        });
      } catch (error: any) {
        message.error('获取统计数据失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">欢迎使用轨迹分析系统</h1>
      <p className="text-gray-600 mb-8">
        GPS轨迹数据分析与可视化平台 - 探索你的足迹，发现你的故事
      </p>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="轨迹点总数"
                value={stats.totalPoints}
                prefix={<EnvironmentOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总行程距离"
                value={(stats.totalDistance / 1000).toFixed(0)}
                prefix={<RiseOutlined />}
                suffix="公里"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="到访省份"
                value={stats.provinceCount}
                prefix={<GlobalOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="到访城市"
                value={stats.cityCount}
                prefix={<ClockCircleOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="停留次数"
                value={stats.stayCount}
                prefix={<HomeOutlined />}
                suffix="次"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="停留总时长"
                value={formatDuration(stats.totalStayDuration)}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Card title="最近分析任务" size="small">
              {recentTasks.length > 0 ? (
                <Timeline
                  items={recentTasks.slice(0, 3).map((task) => ({
                    children: (
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{task.skill_name}</span>
                          <Tag color={task.status === 'completed' ? 'green' : task.status === 'failed' ? 'red' : 'blue'}>
                            {task.status}
                          </Tag>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(task.created_at * 1000).toLocaleString()}
                        </div>
                      </div>
                    ),
                  }))}
                />
              ) : (
                <div className="text-gray-500 text-sm">暂无任务记录</div>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>

      <Card title="快速导航" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/map"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">📍 轨迹地图</h3>
            <p className="text-gray-600 text-sm">
              在地图上查看你的轨迹，支持时间筛选和模式过滤
            </p>
          </Link>
          <Link
            to="/stats/footprint"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">📊 足迹排名</h3>
            <p className="text-gray-600 text-sm">
              查看省市区县的足迹统计和排名
            </p>
          </Link>
          <Link
            to="/stats/stay"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">⏱️ 停留分析</h3>
            <p className="text-gray-600 text-sm">
              分析你在不同地点的停留时间和频次
            </p>
          </Link>
          <Link
            to="/stats/extreme"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">🏆 极值事件</h3>
            <p className="text-gray-600 text-sm">
              查看最高海拔、最快速度等极值记录
            </p>
          </Link>
          <Link
            to="/stats/advanced"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">🔬 高级分析</h3>
            <p className="text-gray-600 text-sm">
              速度空间、方向偏好、重访模式、海拔维度分析
            </p>
          </Link>
          <Link
            to="/admin/import"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">📤 数据导入</h3>
            <p className="text-gray-600 text-sm">
              上传GPS轨迹数据文件，支持增量和全量导入
            </p>
          </Link>
          <Link
            to="/admin/geocoding"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">⚙️ 地理编码</h3>
            <p className="text-gray-600 text-sm">
              管理地理编码任务，将坐标转换为行政区划
            </p>
          </Link>
          <Link
            to="/admin/analysis"
            className="block p-4 border rounded hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">🔧 数据分析</h3>
            <p className="text-gray-600 text-sm">
              触发和管理轨迹分析任务
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
