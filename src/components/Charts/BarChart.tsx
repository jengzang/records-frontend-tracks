import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Button, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { exportCSV, getExportFilename } from '../../utils/export';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
  height?: number;
  showExport?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  yField,
  title,
  height = 400,
  showExport = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Export handlers
  const handleExportPNG = () => {
    if (!chartInstance.current) return;
    const url = chartInstance.current.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    });
    const link = document.createElement('a');
    link.href = url;
    link.download = getExportFilename('chart', 'png');
    link.click();
  };

  const handleExportCSV = () => {
    const filename = getExportFilename('chart_data', 'csv');
    exportCSV(data, filename);
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'png',
      label: '导出为图片 (PNG)',
      onClick: handleExportPNG,
    },
    {
      key: 'csv',
      label: '导出数据 (CSV)',
      onClick: handleExportCSV,
    },
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Prepare data
    const xData = data.map((item) => item[xField]);
    const yData = data.map((item) => item[yField]);

    // Set options
    const option: echarts.EChartsOption = {
      title: title ? { text: title, left: 'center' } : undefined,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      toolbox: showExport ? {
        feature: {
          saveAsImage: {
            title: '保存为图片',
            pixelRatio: 2,
          },
          dataZoom: {
            title: {
              zoom: '区域缩放',
              back: '还原',
            },
          },
        },
      } : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          data: yData,
          itemStyle: {
            color: '#1890ff',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, xField, yField, title]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="relative">
      {showExport && (
        <div className="absolute top-2 right-2 z-10">
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button size="small" icon={<DownloadOutlined />} />
          </Dropdown>
        </div>
      )}
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default BarChart;
