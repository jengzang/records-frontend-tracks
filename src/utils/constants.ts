import { TransportMode } from '../types/track';
import { StayCategory } from '../types/stay';

// Transport mode colors
export const TRANSPORT_MODE_COLORS: Record<TransportMode, string> = {
  [TransportMode.WALK]: '#10b981', // green
  [TransportMode.CAR]: '#3b82f6', // blue
  [TransportMode.TRAIN]: '#8b5cf6', // purple
  [TransportMode.FLIGHT]: '#ef4444', // red
  [TransportMode.STAY]: '#6b7280', // gray
  [TransportMode.UNKNOWN]: '#9ca3af', // light gray
};

// Transport mode labels
export const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  [TransportMode.WALK]: '步行',
  [TransportMode.CAR]: '驾车',
  [TransportMode.TRAIN]: '火车',
  [TransportMode.FLIGHT]: '飞行',
  [TransportMode.STAY]: '停留',
  [TransportMode.UNKNOWN]: '未知',
};

// Stay category colors
export const STAY_CATEGORY_COLORS: Record<StayCategory, string> = {
  [StayCategory.HOME]: '#10b981', // green
  [StayCategory.WORK]: '#3b82f6', // blue
  [StayCategory.TRANSIT]: '#f59e0b', // amber
  [StayCategory.VISIT]: '#8b5cf6', // purple
  [StayCategory.UNKNOWN]: '#6b7280', // gray
};

// Stay category labels
export const STAY_CATEGORY_LABELS: Record<StayCategory, string> = {
  [StayCategory.HOME]: '家',
  [StayCategory.WORK]: '工作',
  [StayCategory.TRANSIT]: '中转',
  [StayCategory.VISIT]: '访问',
  [StayCategory.UNKNOWN]: '未知',
};

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Map configuration
export const MAP_CONFIG = {
  center: [104, 35] as [number, number], // China center
  zoom: 4,
  minZoom: 3,
  maxZoom: 18,
  style: 'mapbox://styles/mapbox/streets-v11', // You may want to use a Chinese map style
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Task refresh interval (ms)
export const TASK_REFRESH_INTERVAL = 2000;
