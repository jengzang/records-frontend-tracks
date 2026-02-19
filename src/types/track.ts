// Track point from database
export interface TrackPoint {
  id: number;
  dataTime: number; // Unix timestamp (seconds)
  longitude: number;
  latitude: number;
  heading: number;
  accuracy: number;
  speed: number;
  distance: number;
  altitude: number;
  time_visually: string; // Format: 2025/01/22 21:42:18.000
  time: string; // Format: 20250122214218

  // Administrative divisions (from geocoding)
  province?: string;
  city?: string;
  county?: string;
  town?: string;
  village?: string;

  // Analysis fields
  outlier_flag?: number;
  qa_status?: string;
  transport_mode?: TransportMode;
  segment_id?: number;
  stay_id?: number;
  trip_id?: number;
  grid_id?: string;
  geohash?: string;

  // Metadata
  created_at?: string;
  updated_at?: string;
  algo_version?: string;
}

// Transport mode enum
export enum TransportMode {
  WALK = 'WALK',
  CAR = 'CAR',
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT',
  STAY = 'STAY',
  UNKNOWN = 'UNKNOWN',
}

// Filter for querying track points
export interface TrackFilter {
  startTime?: number;
  endTime?: number;
  province?: string;
  city?: string;
  county?: string;
  mode?: TransportMode;
  bbox?: BoundingBox;
  page?: number;
  pageSize?: number;
}

// Bounding box for spatial queries
export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}
