import { BoundingBox } from './track';

// Stay category enum
export enum StayCategory {
  HOME = 'HOME',
  WORK = 'WORK',
  TRANSIT = 'TRANSIT',
  VISIT = 'VISIT',
  UNKNOWN = 'UNKNOWN',
}

// Stay segment represents a period of staying at one location
export interface StaySegment {
  id: number;
  start_point_id: number;
  end_point_id: number;
  start_time: number;
  end_time: number;
  duration: number; // seconds
  center_lon: number;
  center_lat: number;
  radius: number; // meters
  point_count: number;

  // Administrative divisions
  province?: string;
  city?: string;
  county?: string;
  town?: string;
  village?: string;

  // Classification
  category: StayCategory;
  confidence: number;
  reason_code?: string;

  // Metadata
  created_at: string;
  algo_version: string;
}

// Filter for querying stays
export interface StayFilter {
  startTime?: number;
  endTime?: number;
  category?: StayCategory;
  province?: string;
  city?: string;
  county?: string;
  minDuration?: number;
  maxDuration?: number;
  bbox?: BoundingBox;
  page?: number;
  pageSize?: number;
}
