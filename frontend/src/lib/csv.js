/**
 * Border Spec CSV Exporter
 * Generates and downloads CSV files for admin reports
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} columns - Optional column definitions [{key, label}]
 */
export const arrayToCSV = (data, columns = null) => {
  if (!data || data.length === 0) return '';

  // Auto-detect columns from first row if not provided
  const cols = columns || Object.keys(data[0]).map((key) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
  }));

  // Header row
  const header = cols.map((c) => `"${c.label}"`).join(',');

  // Data rows
  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return '""';
        // Escape double quotes
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV string
 * @param {string} filename - File name without extension
 */
export const downloadCSV = (csvContent, filename = 'report') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export entry report as CSV
 * @param {Array} reportData - Output from entries.generateEntryReport()
 */
export const exportEntryReport = (reportData) => {
  const columns = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'userEmail', label: 'Email' },
    { key: 'userName', label: 'Name' },
    { key: 'entriesEarned', label: 'Entries Earned' },
    { key: 'multiplierUsed', label: 'Multiplier' },
    { key: 'orderTotal', label: 'Order Total (USD)' },
    { key: 'orderStatus', label: 'Status' },
    { key: 'timestamp', label: 'Timestamp (ISO)' },
    { key: 'verificationHash', label: 'Verification Hash' },
  ];

  const csv = arrayToCSV(reportData, columns);
  downloadCSV(csv, 'border_spec_entries_report');
};

/**
 * Export user summary as CSV
 * @param {Array} summaryData - Output from entries.getUserEntrySummary()
 */
export const exportUserSummary = (summaryData) => {
  const columns = [
    { key: 'userId', label: 'User ID' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'totalEntries', label: 'Total Entries' },
    { key: 'totalSpent', label: 'Total Spent (USD)' },
    { key: 'orderCount', label: 'Orders' },
    { key: 'lastOrderDate', label: 'Last Order Date' },
  ];

  const csv = arrayToCSV(summaryData, columns);
  downloadCSV(csv, 'border_spec_users_summary');
};
