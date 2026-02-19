import api from './api';

// Task status enum
export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Geocoding task
export interface GeocodingTask {
  id: string;
  status: TaskStatus;
  progress: number; // 0-100
  total_points: number;
  processed_points: number;
  success_count: number;
  failed_count: number;
  eta_seconds?: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

// Analysis task
export interface AnalysisTask {
  id: string;
  skill_name: string;
  status: TaskStatus;
  progress: number; // 0-100
  total_items: number;
  processed_items: number;
  eta_seconds?: number;
  error_message?: string;
  result_summary?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

// Create geocoding task
export const createGeocodingTask = async (): Promise<GeocodingTask> => {
  return api.post('/admin/geocoding/tasks');
};

// List geocoding tasks
export const listGeocodingTasks = async (): Promise<GeocodingTask[]> => {
  return api.get('/admin/geocoding/tasks');
};

// Get geocoding task by ID
export const getGeocodingTask = async (id: string): Promise<GeocodingTask> => {
  return api.get(`/admin/geocoding/tasks/${id}`);
};

// Cancel geocoding task
export const cancelGeocodingTask = async (id: string): Promise<void> => {
  return api.delete(`/admin/geocoding/tasks/${id}`);
};

// Create analysis task
export const createAnalysisTask = async (skillName: string): Promise<AnalysisTask> => {
  return api.post('/admin/analysis/tasks', { skill_name: skillName });
};

// List analysis tasks
export const listAnalysisTasks = async (): Promise<AnalysisTask[]> => {
  return api.get('/admin/analysis/tasks');
};

// Get analysis task by ID
export const getAnalysisTask = async (id: string): Promise<AnalysisTask> => {
  return api.get(`/admin/analysis/tasks/${id}`);
};

// Trigger analysis chain
export const triggerAnalysisChain = async (mode: 'incremental' | 'full'): Promise<AnalysisTask[]> => {
  return api.post('/admin/analysis/trigger-chain', { mode });
};
