import React, { useState } from 'react';
import { Card, Switch, Space, Spin } from 'antd';
import type { Map as MapboxMap } from 'mapbox-gl';
import MapViewer from '../../components/Map/MapViewer';
import TrajectoryLayer from '../../components/Map/TrajectoryLayer';
import HeatmapLayer from '../../components/Map/HeatmapLayer';
import TimeAxisFilter from '../../components/Map/TimeAxisFilter';
import ModeFilter from '../../components/Map/ModeFilter';
import StayAnnotation from '../../components/Map/StayAnnotation';

const TrajectoryMap: React.FC = () => {
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showStays, setShowStays] = useState(false);
  const [timeFilter, setTimeFilter] = useState<{
    startTime?: number;
    endTime?: number;
    granularity?: string;
  }>({});
  const [modeFilter, setModeFilter] = useState<string[]>([]);

  const handleMapLoad = (loadedMap: MapboxMap) => {
    setMap(loadedMap);
    setLoading(false);
  };

  const handleTimeFilterChange = (filter: {
    startTime?: number;
    endTime?: number;
    granularity?: string;
  }) => {
    setTimeFilter(filter);
  };

  const handleModeFilterChange = (modes: string[]) => {
    setModeFilter(modes);
  };

  const combinedFilter = {
    ...timeFilter,
    modes: modeFilter.length > 0 ? modeFilter : undefined,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">轨迹地图</h1>
        <p className="text-gray-600">可视化GPS轨迹、热力图和停留点</p>
      </div>

      {/* Filters */}
      <TimeAxisFilter onFilterChange={handleTimeFilterChange} />

      <div className="flex gap-4 flex-1">
        {/* Sidebar */}
        <div className="w-64 space-y-4">
          {/* Layer Controls */}
          <Card title="图层控制" size="small">
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center">
                <span>轨迹线</span>
                <Switch checked={showTrajectory} onChange={setShowTrajectory} />
              </div>
              <div className="flex justify-between items-center">
                <span>热力图</span>
                <Switch checked={showHeatmap} onChange={setShowHeatmap} />
              </div>
              <div className="flex justify-between items-center">
                <span>停留点</span>
                <Switch checked={showStays} onChange={setShowStays} />
              </div>
            </Space>
          </Card>

          {/* Mode Filter */}
          <ModeFilter onFilterChange={handleModeFilterChange} />
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <Spin size="large" tip="加载地图中..." />
            </div>
          )}
          <MapViewer onMapLoad={handleMapLoad} />
          <TrajectoryLayer map={map} visible={showTrajectory} filter={combinedFilter} />
          <HeatmapLayer map={map} visible={showHeatmap} filter={combinedFilter} />
          <StayAnnotation map={map} visible={showStays} filter={combinedFilter} />
        </div>
      </div>
    </div>
  );
};

export default TrajectoryMap;
