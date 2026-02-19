import React, { useState } from 'react';
import { DatePicker, Select, Card } from 'antd';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface TimeAxisFilterProps {
  onFilterChange: (filter: {
    startTime?: number;
    endTime?: number;
    granularity?: string;
  }) => void;
}

const TimeAxisFilter: React.FC<TimeAxisFilterProps> = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [granularity, setGranularity] = useState<string>('day');

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates) {
      setDateRange([null, null]);
      onFilterChange({});
      return;
    }

    setDateRange(dates);
    const [start, end] = dates;

    if (start && end) {
      onFilterChange({
        startTime: start.unix(),
        endTime: end.unix(),
        granularity,
      });
    }
  };

  const handleGranularityChange = (value: string) => {
    setGranularity(value);
    const [start, end] = dateRange;

    if (start && end) {
      onFilterChange({
        startTime: start.unix(),
        endTime: end.unix(),
        granularity: value,
      });
    }
  };

  return (
    <Card className="mb-4" size="small">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">时间范围:</span>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">粒度:</span>
          <Select
            value={granularity}
            onChange={handleGranularityChange}
            style={{ width: 100 }}
            options={[
              { label: '天', value: 'day' },
              { label: '月', value: 'month' },
              { label: '年', value: 'year' },
            ]}
          />
        </div>
      </div>
    </Card>
  );
};

export default TimeAxisFilter;
