/**
 * Export utility functions for data export
 */

/**
 * Convert array of objects to CSV format
 */
export const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');

  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Handle null/undefined
      if (value === null || value === undefined) return '';

      // Convert to string
      const stringValue = String(value);

      // Escape values containing comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',')
  );

  return [headerRow, ...rows].join('\n');
};

/**
 * Download file to user's device
 */
export const downloadFile = (content: string | Blob, filename: string, mimeType: string = 'text/plain') => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data as JSON file
 */
export const exportJSON = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

/**
 * Export data as CSV file
 */
export const exportCSV = (data: any[], filename: string) => {
  const csv = convertToCSV(data);
  // Add BOM for Excel UTF-8 support
  const bom = '\uFEFF';
  downloadFile(bom + csv, filename, 'text/csv;charset=utf-8');
};

/**
 * Format date for filename
 */
export const getExportFilename = (prefix: string, extension: string): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}.${extension}`;
};
