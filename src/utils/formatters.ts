import dayjs from 'dayjs';

// Format distance in meters to human-readable string
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)}米`;
  }
  return `${(meters / 1000).toFixed(2)}公里`;
};

// Format duration in seconds to human-readable string
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(0)}秒`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return hours > 0 ? `${days}天${hours}小时` : `${days}天`;
};

// Format Unix timestamp to Chinese date string
export const formatTimestamp = (unix: number): string => {
  return dayjs.unix(unix).format('YYYY年MM月DD日 HH:mm:ss');
};

// Format Unix timestamp to short date
export const formatDate = (unix: number): string => {
  return dayjs.unix(unix).format('YYYY-MM-DD');
};

// Format speed in km/h
export const formatSpeed = (kmh: number): string => {
  return `${kmh.toFixed(1)}公里/小时`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Format large numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};
