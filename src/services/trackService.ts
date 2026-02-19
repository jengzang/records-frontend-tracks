import api, { PaginationResponse } from './api';
import { Segment, SegmentFilter } from '../types/segment';
import { StaySegment, StayFilter } from '../types/stay';
import { Trip, TripFilter } from '../types/trip';
import { TransportMode, BoundingBox } from '../types/track';

// Rendering metadata for visualization
export interface RenderingMetadata {
  id: number;
  longitude: number;
  latitude: number;
  mode: TransportMode;
  speed: number;
  render_width: number;
  render_opacity: number;
  timestamp: number;
}

// Grid cell for heatmap
export interface GridCell {
  grid_id: string;
  center_lon: number;
  center_lat: number;
  point_count: number;
  duration_seconds: number;
  density: number;
}

// Time slice for time axis
export interface TimeSlice {
  time_key: string; // YYYYMMDD or YYYYMM or YYYY
  point_count: number;
  distance: number; // meters
  duration: number; // seconds
}

// Rendering filter
export interface RenderingFilter {
  bbox?: BoundingBox;
  lod?: number; // Level of detail (1-5)
  startTime?: number;
  endTime?: number;
  modes?: string[];
}

// Grid filter
export interface GridFilter {
  level?: number; // Grid level (1-5)
  bbox?: BoundingBox;
  minDensity?: number;
  startTime?: number;
  endTime?: number;
}

// Get rendering metadata
export const getRenderingMetadata = async (filter?: RenderingFilter): Promise<RenderingMetadata[]> => {
  const response = await api.get('/viz/rendering', { params: filter });
  return response.data || response; // Handle both {data: [...]} and [...] responses
};

// Get grid cells for heatmap
export const getGridCells = async (filter?: GridFilter): Promise<GridCell[]> => {
  const response = await api.get('/viz/grid-cells', { params: filter });
  return response.data || response;
};

// Get time slices
export const getTimeSlices = async (
  startTime: number,
  endTime: number,
  granularity: 'day' | 'month' | 'year'
): Promise<TimeSlice[]> => {
  const response = await api.get('/viz/time-slices', {
    params: { startTime, endTime, granularity },
  });
  return response.data || response;
};

// Get segments
export const getSegments = async (filter: SegmentFilter): Promise<PaginationResponse<Segment>> => {
  return api.get('/tracks/segments', { params: filter });
};

// Get stays
export const getStays = async (filter?: StayFilter): Promise<StaySegment[]> => {
  const response = await api.get('/tracks/stays', { params: filter });
  return response.data || response;
};

// Get trips
export const getTrips = async (filter: TripFilter): Promise<PaginationResponse<Trip>> => {
  return api.get('/tracks/trips', { params: filter });
};
