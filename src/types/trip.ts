import { TransportMode, BoundingBox } from './track';

// Trip represents a journey from one stay to another
export interface Trip {
  id: number;
  start_stay_id?: number;
  end_stay_id?: number;
  start_time: number;
  end_time: number;
  duration: number; // seconds
  distance: number; // meters
  segment_count: number;

  // Spatial info
  start_lon: number;
  start_lat: number;
  end_lon: number;
  end_lat: number;
  start_province?: string;
  start_city?: string;
  end_province?: string;
  end_city?: string;

  // Transport modes used in this trip
  primary_mode: TransportMode;
  modes_used: TransportMode[];

  // Metadata
  created_at: string;
  algo_version: string;
}

// Filter for querying trips
export interface TripFilter {
  startTime?: number;
  endTime?: number;
  primaryMode?: TransportMode;
  startProvince?: string;
  startCity?: string;
  endProvince?: string;
  endCity?: string;
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
  bbox?: BoundingBox;
  page?: number;
  pageSize?: number;
}
