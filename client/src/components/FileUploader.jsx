import React from 'react';
import Papa from 'papaparse';

export default function FileUploader({ setRawRows }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        setRawRows(results.data);
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
