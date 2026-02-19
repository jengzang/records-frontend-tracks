// Footprint statistics
export interface FootprintStatistics {
  stat_type: StatType;
  name: string; // Province/City/County/Town/Grid ID
  point_count: number;
  visit_count: number;
  duration_seconds: number; // Changed from total_duration
  distance_meters: number; // Changed from total_distance
  first_visit: number; // Unix timestamp
  last_visit: number; // Unix timestamp
  rank?: number;
}

// Stay statistics
export interface StayStatistics {
  stat_type: StatType;
  name: string; // Province/City/County/Category
  stay_count: number;
  total_duration_seconds: number; // Changed from total_duration
  avg_duration_seconds: number; // Changed from avg_duration
  rank?: number;
}

// Extreme event
export interface ExtremeEvent {
  event_type: EventType;
  event_category: string;
  value: number;
  point_id: number;
  timestamp: number;
  longitude: number;
  latitude: number;
  province?: string;
  city?: string;
  county?: string;
  mode?: string;
  confidence?: number;
  description: string;
}

// Stat type enum
export enum StatType {
  PROVINCE = 'PROVINCE',
  CITY = 'CITY',
  COUNTY = 'COUNTY',
  TOWN = 'TOWN',
  GRID = 'GRID',
  CATEGORY = 'CATEGORY',
}

// Event type enum
export enum EventType {
  MAX_ALTITUDE = 'MAX_ALTITUDE',
  MAX_SPEED = 'MAX_SPEED',
  SPATIAL_EXTREMES = 'SPATIAL_EXTREMES',
}

// Filter for statistics queries
export interface StatsFilter {
  statType?: string;
  timeRange?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

// Time range enum
export enum TimeRange {
  ALL = 'ALL',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
}

// Filter for extreme events
export interface ExtremeEventFilter {
  eventType?: EventType;
  eventCategory?: string;
  startTime?: number;
  endTime?: number;
}
