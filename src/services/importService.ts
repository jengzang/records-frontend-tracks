import api from './api';
import { ImportTask, ImportTaskResponse } from '../types/import';

/**
 * 创建导入任务（文件上传）
 */
export const createImportTask = (
  file: File,
  mode: 'append' | 'replace' = 'append',
  deduplicate: boolean = true,
  autoTrigger: boolean = true
): Promise<ImportTaskResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', mode);
  formData.append('deduplicate', deduplicate.toString());
  formData.append('auto_trigger', autoTrigger.toString());

  return api.post('/admin/tracks/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * 获取导入任务状态
 */
export const getImportTask = (id: number): Promise<ImportTask> => {
  return api.get(`/admin/tracks/import/${id}`);
};

/**
 * 触发完整流水线（导入+地理编码+分析）
 */
export const triggerPipeline = (
  file: File,
  mode: 'append' | 'replace' = 'append',
  deduplicate: boolean = true
): Promise<ImportTaskResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', mode);
  formData.append('deduplicate', deduplicate.toString());

  return api.post('/admin/pipeline/trigger', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * 获取导入任务列表
 */
export const listImportTasks = (limit: number = 50, offset: number = 0): Promise<ImportTask[]> => {
  return api.get('/admin/tracks/import', {
    params: { limit, offset }
  });
};
