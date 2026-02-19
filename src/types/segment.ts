import { TransportMode, BoundingBox } from './track';

// Segment represents a continuous trajectory with same transport mode
export interface Segment {
  id: number;
  start_point_id: number;
  end_point_id: number;
  start_time: number;
  end_time: number;
  transport_mode: TransportMode;
  distance: number; // meters
  duration: number; // seconds
  avg_speed: number; // km/h
  max_speed: number; // km/h
  point_count: number;

  // Spatial info
  start_lon: number;
  start_lat: number;
  end_lon: number;
  end_lat: number;
  province?: string;
  city?: string;
  county?: string;

  // Metadata
  confidence: number;
  reason_code?: string;
  created_at: string;
  algo_version: string;
}

// Filter for querying segments
export interface SegmentFilter {
  startTime?: number;
  endTime?: number;
  mode?: TransportMode;
  province?: string;
  city?: string;
  county?: string;
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
  bbox?: BoundingBox;
  page?: number;
  pageSize?: number;
}
