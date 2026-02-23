import React, { useState, useEffect } from 'react';
import { Card, Tabs, message, Spin, Row, Col, Statistic, Tag } from 'antd';
import {
  ThunderboltOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import api from '../../services/api';

const { TabPane } = Tabs;

interface SpeedSpaceStats {
  grid_id: string;
  avg_speed_kmh: number;
  max_speed_kmh: number;
  point_count: number;
  zone_type: 'HIGH_SPEED' | 'SLOW_LIFE' | 'NORMAL';
}

interface DirectionalBiasStats {
  area_name: string;
  dominant_direction: string;
  direction_entropy: number;
  bidirectional: boolean;
}

interface RevisitPattern {
  location_name: string;
  visit_count: number;
  avg_interval_days: number;
  pattern_type: 'HABITUAL' | 'PERIODIC' | 'OCCASIONAL';
}

interface AltitudeStats {
  max_altitude: number;
  min_altitude: number;
  avg_altitude: number;
  altitude_range: number;
}

const AdvancedAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [speedSpaceData, setSpeedSpaceData] = useState<SpeedSpaceStats[]>([]);
  const [directionalData, setDirectionalData] = useState<DirectionalBiasStats[]>([]);
  const [revisitData, setRevisitData] = useState<RevisitPattern[]>([]);
  const [altitudeData, setAltitudeData] = useState<AltitudeStats | null>(null);

  const fetchSpeedSpaceData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/speed-space');
      setSpeedSpaceData(response.data || response);
    } catch (error: any) {
      message.error('获取速度空间数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectionalData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/directional-bias');
      setDirectionalData(response.data || response);
    } catch (error: any) {
      message.error('获取方向偏好数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevisitData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/revisit-patterns');
      setRevisitData(response.data || response);
    } catch (error: any) {
      message.error('获取重访模式数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchAltitudeData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/altitude');
      setAltitudeData(response.data || response);
    } catch (error: any) {
      message.error('获取海拔数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeedSpaceData();
  }, []);

  const getZoneTypeColor = (zoneType: string) => {
    switch (zoneType) {
      case 'HIGH_SPEED':
        return 'red';
      case 'SLOW_LIFE':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getZoneTypeLabel = (zoneType: string) => {
    switch (zoneType) {
      case 'HIGH_SPEED':
        return '高速区域';
      case 'SLOW_LIFE':
        return '慢生活区';
      default:
        return '普通区域';
    }
  };

  const getPatternTypeColor = (patternType: string) => {
    switch (patternType) {
      case 'HABITUAL':
        return 'purple';
      case 'PERIODIC':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const getPatternTypeLabel = (patternType: string) => {
    switch (patternType) {
      case 'HABITUAL':
        return '习惯性';
      case 'PERIODIC':
        return '周期性';
      default:
        return '偶尔';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">高级分析</h1>
        <p className="text-gray-600">深度挖掘轨迹数据中的模式和洞察</p>
      </div>

      <Tabs defaultActiveKey="speed-space" onChange={(key) => {
        if (key === 'directional' && directionalData.length === 0) fetchDirectionalData();
        if (key === 'revisit' && revisitData.length === 0) fetchRevisitData();
        if (key === 'altitude' && !altitudeData) fetchAltitudeData();
      }}>
        <TabPane
          tab={
            <span>
              <ThunderboltOutlined />
              速度空间耦合
            </span>
          }
          key="speed-space"
        >
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {speedSpaceData.slice(0, 12).map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card>
                    <Statistic
                      title={
                        <div className="flex items-center justify-between">
                          <span>网格 {item.grid_id}</span>
                          <Tag color={getZoneTypeColor(item.zone_type)}>
                            {getZoneTypeLabel(item.zone_type)}
                          </Tag>
                        </div>
                      }
                      value={item.avg_speed_kmh}
                      suffix="km/h"
                      precision={1}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <div>最高速度: {item.max_speed_kmh.toFixed(1)} km/h</div>
                      <div>数据点数: {item.point_count.toLocaleString()}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            {speedSpaceData.length === 0 && !loading && (
              <Card>
                <div className="text-center text-gray-500 py-8">
                  暂无速度空间数据
                </div>
              </Card>
            )}
          </Spin>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CompassOutlined />
              方向偏好
            </span>
          }
          key="directional"
        >
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {directionalData.slice(0, 12).map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card>
                    <Statistic
                      title={item.area_name}
                      value={item.dominant_direction}
                      valueStyle={{ fontSize: '20px' }}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <div>方向熵: {item.direction_entropy.toFixed(2)}</div>
                      <div>
                        {item.bidirectional ? (
                          <Tag color="blue">双向通行</Tag>
                        ) : (
                          <Tag>单向为主</Tag>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            {directionalData.length === 0 && !loading && (
              <Card>
                <div className="text-center text-gray-500 py-8">
                  暂无方向偏好数据
                </div>
              </Card>
            )}
          </Spin>
        </TabPane>

        <TabPane
          tab={
            <span>
              <EnvironmentOutlined />
              重访模式
            </span>
          }
          key="revisit"
        >
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {revisitData.slice(0, 12).map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card>
                    <Statistic
                      title={
                        <div className="flex items-center justify-between">
                          <span>{item.location_name}</span>
                          <Tag color={getPatternTypeColor(item.pattern_type)}>
                            {getPatternTypeLabel(item.pattern_type)}
                          </Tag>
                        </div>
                      }
                      value={item.visit_count}
                      suffix="次访问"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <div>
                        <ClockCircleOutlined className="mr-1" />
                        平均间隔: {item.avg_interval_days.toFixed(1)} 天
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            {revisitData.length === 0 && !loading && (
              <Card>
                <div className="text-center text-gray-500 py-8">
                  暂无重访模式数据
                </div>
              </Card>
            )}
          </Spin>
        </TabPane>

        <TabPane
          tab={
            <span>
              <RiseOutlined />
              海拔维度
            </span>
          }
          key="altitude"
        >
          <Spin spinning={loading}>
            {altitudeData && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="最高海拔"
                      value={altitudeData.max_altitude}
                      suffix="米"
                      precision={0}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="最低海拔"
                      value={altitudeData.min_altitude}
                      suffix="米"
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="平均海拔"
                      value={altitudeData.avg_altitude}
                      suffix="米"
                      precision={0}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="海拔跨度"
                      value={altitudeData.altitude_range}
                      suffix="米"
                      precision={0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
            {!altitudeData && !loading && (
              <Card>
                <div className="text-center text-gray-500 py-8">
                  暂无海拔数据
                </div>
              </Card>
            )}
          </Spin>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
