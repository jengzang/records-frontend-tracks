import api, { PaginationResponse } from './api';
import {
  FootprintStatistics,
  StayStatistics,
  ExtremeEvent,
  StatsFilter,
  ExtremeEventFilter,
} from '../types/statistics';

// Export types for convenience
export type FootprintRanking = FootprintStatistics;
export type StayRanking = StayStatistics;
export type { ExtremeEvent };

// Get footprint rankings
export const getFootprintRankings = async (
  filter: StatsFilter
): Promise<PaginationResponse<FootprintStatistics>> => {
  return api.get('/stats/footprint/rankings', { params: filter });
};

// Get stay rankings
export const getStayRankings = async (
  filter: StatsFilter
): Promise<PaginationResponse<StayStatistics>> => {
  return api.get('/stats/stay/rankings', { params: filter });
};

// Get extreme events
export const getExtremeEvents = async (filter: ExtremeEventFilter): Promise<ExtremeEvent[]> => {
  return api.get('/stats/extreme-events', { params: filter });
};
