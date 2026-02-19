import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface LineChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  title,
  height = 400,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

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
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          data: yData,
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ]),
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

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default LineChart;
