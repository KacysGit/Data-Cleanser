// Location: client/src/App.jsx

import React, { useState } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import './styles/globals.css';

function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(Boolean);

    const headers = lines[0].split(',');
    const data = lines.slice(1).map((line) => {
      const values = line.split(',');
      return Object.fromEntries(headers.map((key, i) => [key, values[i] || '']));
    });

    const formattedColumns = headers.map((header) => ({
      key: header,
      name: header,
      resizable: true,
      width: 200,
      formatter: ({ row }) => (
        <div style={{ maxHeight: '80px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          {row[header]}
        </div>
      )
    }));

    setColumns(formattedColumns);
    setRows(data);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Upload CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {rows.length > 0 && (
        <div style={{ marginTop: '1rem', height: '80vh' }}>
          <DataGrid columns={columns} rows={rows} />
        </div>
      )}
    </div>
  );
}

export default App;
