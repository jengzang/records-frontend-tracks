import api, { PaginationResponse } from './api';
import { BoundingBox } from '../types/track';

// GPS Point interface
export interface GPSPoint {
  id: number;
  dataTime: number;
  longitude: number;
  latitude: number;
  heading: number;
  accuracy: number;
  speed: number;
  distance: number;
  altitude: number;
  time_visually: string;
  time: string;
  province?: string;
  city?: string;
  county?: string;
  town?: string;
  village?: string;
  outlier_flag?: number;
  outlier_reasons?: string[];
  qa_status?: string;
}

// GPS Points filter
export interface GPSPointsFilter {
  startTime?: number;
  endTime?: number;
  province?: string;
  city?: string;
  county?: string;
  minAccuracy?: number;
  excludeOutliers?: boolean;
  offset?: number;
  limit?: number;
}

// Administrative crossing
export interface AdminCrossing {
  from_province: string;
  from_city: string;
  to_province: string;
  to_city: string;
  crossing_count: number;
  first_crossing: number;
  last_crossing: number;
}

// Heatmap point
export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  value: number;
  metric: string;
}

// Heatmap response
export interface HeatmapResponse {
  points: HeatmapPoint[];
  count: number;
  max_value: number;
  min_value: number;
  metric: string;
  grid_level: number;
}

// Heatmap filter
export interface HeatmapFilter {
  level?: number;
  metric?: 'point_count' | 'duration' | 'visit_count';
  minLat?: number;
  maxLat?: number;
  minLon?: number;
  maxLon?: number;
}

/**
 * Get GPS trajectory points with filtering and pagination
 */
export const getGPSPoints = async (
  filter?: GPSPointsFilter
): Promise<PaginationResponse<GPSPoint>> => {
  return api.get('/tracks/points', { params: filter });
};

/**
 * Get administrative boundary crossings
 */
export const getAdminCrossings = async (params?: {
  level?: 'province' | 'city' | 'county';
  year?: number;
  month?: number;
}): Promise<AdminCrossing[]> => {
  const response = await api.get('/tracks/statistics/crossings', { params });
  return response.items || response;
};

/**
 * Get heatmap data with normalized intensity scores
 */
export const getHeatmapData = async (
  filter?: HeatmapFilter
): Promise<HeatmapResponse> => {
  return api.get('/viz/heatmap', { params: filter });
};

/**
 * Delete GPS points by criteria (Protected)
 */
export const deleteGPSPoints = async (criteria: {
  start_time?: number;
  end_time?: number;
  province?: string;
  city?: string;
}): Promise<{ deleted_count: number }> => {
  return api.delete('/tracks/points', { data: criteria });
};

/**
 * Update a specific GPS point (Protected)
 */
export const updateGPSPoint = async (
  id: number,
  updates: {
    outlier_flag?: number;
    outlier_reasons?: string[];
    qa_status?: string;
  }
): Promise<{ id: number; updated_fields: string[] }> => {
  return api.put(`/tracks/points/${id}`, updates);
};
