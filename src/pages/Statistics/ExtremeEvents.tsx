import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, message, Tag, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  EnvironmentOutlined,
  RiseOutlined,
  CompassOutlined,
  CalendarOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { getExtremeEvents, ExtremeEvent } from '../../services/statsService';
import { exportExtremeEventsCSV, exportExtremeEventsJSON } from '../../services/exportService';
import { formatTimestamp } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const ExtremeEvents: React.FC = () => {
  const [events, setEvents] = useState<ExtremeEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getExtremeEvents({});
      setEvents(data);
    } catch (error: any) {
      message.error(error.message || '获取极值事件失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'MAX_ALTITUDE':
        return <RiseOutlined />;
      case 'MAX_SPEED':
        return <RiseOutlined />;
      case 'SPATIAL_EXTREMES':
        return <CompassOutlined />;
      default:
        return <EnvironmentOutlined />;
    }
  };

  const getEventTitle = (eventType: string, eventCategory: string) => {
    if (eventType === 'MAX_ALTITUDE') return '最高海拔';
    if (eventType === 'MAX_SPEED') return '最高速度';
    if (eventType === 'SPATIAL_EXTREMES') {
      switch (eventCategory) {
        case 'NORTHERNMOST':
          return '最北点';
        case 'SOUTHERNMOST':
          return '最南点';
        case 'EASTERNMOST':
          return '最东点';
        case 'WESTERNMOST':
          return '最西点';
        default:
          return eventCategory;
      }
    }
    return eventType;
  };

  const getEventValue = (event: ExtremeEvent) => {
    if (event.event_type === 'MAX_ALTITUDE') {
      return `${event.value.toFixed(0)} 米`;
    }
    if (event.event_type === 'MAX_SPEED') {
      return `${event.value.toFixed(1)} km/h`;
    }
    return `${event.latitude.toFixed(4)}°, ${event.longitude.toFixed(4)}°`;
  };

  const handleViewOnMap = (event: ExtremeEvent) => {
    // Navigate to map with location
    navigate(`/map?lat=${event.latitude}&lon=${event.longitude}&zoom=12`);
  };

  // Export menu items
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: '导出为 CSV',
      onClick: () => exportExtremeEventsCSV({}),
    },
    {
      key: 'json',
      label: '导出为 JSON',
      onClick: () => exportExtremeEventsJSON({}),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">极值事件</h1>
          <p className="text-gray-600">记录轨迹中的极值点和特殊事件</p>
        </div>
        <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
          <Button icon={<DownloadOutlined />}>导出数据</Button>
        </Dropdown>
      </div>

      <Row gutter={[16, 16]}>
        {events.map((event, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              loading={loading}
              hoverable
              actions={[
                <Button
                  type="link"
                  icon={<EnvironmentOutlined />}
                  onClick={() => handleViewOnMap(event)}
                >
                  在地图上查看
                </Button>,
              ]}
            >
              <Statistic
                title={
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.event_type)}
                    <span>{getEventTitle(event.event_type, event.event_category)}</span>
                  </div>
                }
                value={getEventValue(event)}
                valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
              />
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{formatTimestamp(event.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined />
                  <span>
                    {event.province || ''} {event.city || ''} {event.county || ''}
                  </span>
                </div>
                {event.mode && (
                  <div>
                    <Tag color="blue">{event.mode}</Tag>
                  </div>
                )}
                {event.confidence !== undefined && (
                  <div>
                    <span>置信度: {(event.confidence * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {events.length === 0 && !loading && (
        <Card>
          <div className="text-center text-gray-500 py-8">
            暂无极值事件数据
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExtremeEvents;
