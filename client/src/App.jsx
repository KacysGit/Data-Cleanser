// client/src/App.jsx
import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataGridWrapper from './components/DataGridWrapper';

export default function App() {
  const [rows, setRows] = useState([]);

  // Generate columns dynamically from the first row keys
  const initialColumns = rows.length
    ? Object.keys(rows[0]).map((key) => ({
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        width: 150,
      }))
    : [];
console.log('Columns:', initialColumns);
console.log('Rows:', rows);

  return (
    <div style={{ padding: 20 }}>
      <h1>Data Cleanser - Hiking Trails</h1>
      <FileUploader setRows={setRows} />
      {rows.length > 0 && (
        <DataGridWrapper rows={rows} initialColumns={initialColumns} />
      )}
    </div>
  );
}
