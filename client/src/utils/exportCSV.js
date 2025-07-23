// client/utils/exportCSV.js
export function exportToCSV(rows, filename = 'export.csv') {
  if (!rows || !rows.length) {
    alert('No data to export');
    return;
  }

  // Extract column headers from keys of first row
  const headers = Object.keys(rows[0]);
  
  // Build CSV content
  const csvContent = [
    headers.join(','), // header row
    ...rows.map(row =>
      headers.map(fieldName => {
        let field = row[fieldName];

        if (field === null || field === undefined) return '';

        // Escape quotes by doubling them
        field = field.toString().replace(/"/g, '""');

        // Wrap fields containing commas or quotes in double quotes
        if (field.search(/("|,|\n)/g) >= 0) {
          field = `"${field}"`;
        }
        return field;
      }).join(',')
    )
  ].join('\n');

  // Create Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
