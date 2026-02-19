import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import { TRANSPORT_MODE_COLORS } from '../../utils/constants';

const TRANSPORT_MODES = [
  { value: 'WALK', label: '步行', color: TRANSPORT_MODE_COLORS.WALK },
  { value: 'CAR', label: '驾车', color: TRANSPORT_MODE_COLORS.CAR },
  { value: 'TRAIN', label: '火车', color: TRANSPORT_MODE_COLORS.TRAIN },
  { value: 'FLIGHT', label: '飞行', color: TRANSPORT_MODE_COLORS.FLIGHT },
  { value: 'STAY', label: '停留', color: TRANSPORT_MODE_COLORS.STAY },
];

interface ModeFilterProps {
  onFilterChange: (modes: string[]) => void;
}

const ModeFilter: React.FC<ModeFilterProps> = ({ onFilterChange }) => {
  const [selectedModes, setSelectedModes] = useState<string[]>(
    TRANSPORT_MODES.map((m) => m.value)
  );

  const handleModeChange = (mode: string, checked: boolean) => {
    const newModes = checked
      ? [...selectedModes, mode]
      : selectedModes.filter((m) => m !== mode);

    setSelectedModes(newModes);
    onFilterChange(newModes);
  };

  return (
    <Card title="交通方式" size="small" className="mb-4">
      <div className="space-y-2">
        {TRANSPORT_MODES.map((mode) => (
          <div key={mode.value} className="flex items-center gap-2">
            <Checkbox
              checked={selectedModes.includes(mode.value)}
              onChange={(e) => handleModeChange(mode.value, e.target.checked)}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded"
                  style={{ backgroundColor: mode.color }}
                />
                {mode.label}
              </span>
            </Checkbox>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ModeFilter;
