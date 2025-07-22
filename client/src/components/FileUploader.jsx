// client/src/components/FileUploader.jsx
import React from 'react';
import Papa from 'papaparse';

export default function FileUploader({ setRows }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        const rowsWithIndex = results.data.map((row, idx) => ({ idx, ...row }));
        setRows(rowsWithIndex);
      },

      error: (error) => {
        alert('Error parsing CSV: ' + error.message);
      },
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        aria-label="Upload CSV file"
      />
    </div>
  );
}
