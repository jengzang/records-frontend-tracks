import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
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
        axisPointer: {
          type: 'shadow',
        },
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

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default BarChart;
