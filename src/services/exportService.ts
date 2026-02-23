/**
 * Export service for data export functionality
 */

import { getFootprintRankings, getStayRankings, getExtremeEvents } from './statsService';
import { StatsFilter, ExtremeEventFilter } from '../types/statistics';
import { exportCSV, exportJSON, getExportFilename } from '../utils/export';
import { message } from 'antd';

/**
 * Export footprint rankings as CSV
 */
export const exportFootprintCSV = async (filter: StatsFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    // Fetch all data (remove pagination)
    const response = await getFootprintRankings({ ...filter, limit: 10000, offset: 0 });

    if (response.items.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    // Format data for export
    const exportData = response.items.map(item => ({
      '行政区划': item.name,
      '访问次数': item.visit_count,
      '点数': item.point_count,
      '总时长(小时)': (item.duration_seconds / 3600).toFixed(2),
      '总距离(公里)': (item.distance_meters / 1000).toFixed(2),
      '首次访问': new Date(item.first_visit * 1000).toLocaleString('zh-CN'),
      '最后访问': new Date(item.last_visit * 1000).toLocaleString('zh-CN'),
    }));

    const filename = getExportFilename(`footprint_${filter.statType}`, 'csv');
    exportCSV(exportData, filename);

    message.success({ content: `成功导出 ${response.items.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};

/**
 * Export footprint rankings as JSON
 */
export const exportFootprintJSON = async (filter: StatsFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    const response = await getFootprintRankings({ ...filter, limit: 10000, offset: 0 });

    if (response.items.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    const filename = getExportFilename(`footprint_${filter.statType}`, 'json');
    exportJSON(response, filename);

    message.success({ content: `成功导出 ${response.items.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};

/**
 * Export stay rankings as CSV
 */
export const exportStayCSV = async (filter: StatsFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    const response = await getStayRankings({ ...filter, limit: 10000, offset: 0 });

    if (response.items.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    const exportData = response.items.map(item => ({
      '行政区划': item.name,
      '停留次数': item.stay_count,
      '总停留时长(小时)': (item.total_duration_seconds / 3600).toFixed(2),
      '平均停留时长(小时)': (item.avg_duration_seconds / 3600).toFixed(2),
    }));

    const filename = getExportFilename(`stay_${filter.statType}`, 'csv');
    exportCSV(exportData, filename);

    message.success({ content: `成功导出 ${response.items.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};

/**
 * Export stay rankings as JSON
 */
export const exportStayJSON = async (filter: StatsFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    const response = await getStayRankings({ ...filter, limit: 10000, offset: 0 });

    if (response.items.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    const filename = getExportFilename(`stay_${filter.statType}`, 'json');
    exportJSON(response, filename);

    message.success({ content: `成功导出 ${response.items.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};

/**
 * Export extreme events as CSV
 */
export const exportExtremeEventsCSV = async (filter: ExtremeEventFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    const events = await getExtremeEvents(filter);

    if (events.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    const exportData = events.map(event => ({
      '事件类型': event.event_type,
      '事件类别': event.event_category,
      '时间': new Date(event.timestamp * 1000).toLocaleString('zh-CN'),
      '经度': event.longitude.toFixed(6),
      '纬度': event.latitude.toFixed(6),
      '数值': event.value.toFixed(2),
      '描述': event.description,
    }));

    const filename = getExportFilename('extreme_events', 'csv');
    exportCSV(exportData, filename);

    message.success({ content: `成功导出 ${events.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};

/**
 * Export extreme events as JSON
 */
export const exportExtremeEventsJSON = async (filter: ExtremeEventFilter) => {
  try {
    message.loading({ content: '正在导出数据...', key: 'export' });

    const events = await getExtremeEvents(filter);

    if (events.length === 0) {
      message.warning({ content: '没有数据可导出', key: 'export' });
      return;
    }

    const filename = getExportFilename('extreme_events', 'json');
    exportJSON(events, filename);

    message.success({ content: `成功导出 ${events.length} 条数据`, key: 'export' });
  } catch (error) {
    console.error('Export failed:', error);
    message.error({ content: '导出失败，请重试', key: 'export' });
  }
};
