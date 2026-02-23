export interface ImportTask {
  id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  file_path: string;
  file_name: string;
  file_size: number;
  mode: 'append' | 'replace';
  deduplicate: boolean;
  auto_trigger: boolean;
  total_records: number;
  new_records: number;
  duplicate_records: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CreateImportTaskRequest {
  file: File;
  mode?: 'append' | 'replace';
  deduplicate?: boolean;
  auto_trigger?: boolean;
}

export interface ImportTaskResponse {
  task_id: number;
  status: string;
  message: string;
}
