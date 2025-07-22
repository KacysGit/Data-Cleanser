import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import DataGridWrapper from './components/DataGridWrapper';

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);

  // Regenerate rows with index column when rawRows, includeIndex, or indexStart changes
  useEffect(() => {
    console.log('rawRows:', rawRows);
    if (!rawRows.length) {
      setRows([]);
      return;
    }
    if (includeIndex) {
      const newRows = rawRows.map((row, i) => ({
        idx: i + indexStart,
        ...row,
      }));
      console.log('Setting rows with index:', newRows);
      setRows(newRows);
    } else {
      console.log('Setting rows without index:', rawRows);
      setRows(rawRows);
    }
  }, [rawRows, includeIndex, indexStart]);

  // Prepare columns with idx on far left if included
  const initialColumns = rows.length
    ? [
        ...(Object.prototype.hasOwnProperty.call(rows[0], 'idx')
          ? [
              {
                key: 'idx',
                name: 'Index',
                width: 80,
                resizable: true,
                sortable: true,
              },
            ]
          : []),
        ...Object.keys(rows[0])
          .filter((key) => key !== 'idx')
          .map((key) => ({
            key,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
            resizable: true,
            sortable: true,
          })),
      ]
    : [];

  // Now log AFTER initialColumns is defined
  console.log('Initial columns:', initialColumns);
  console.log('Rows passed to grid:', rows);

  // Handle checkbox toggle
  function toggleIncludeIndex(e) {
    setIncludeIndex(e.target.checked);
    if (e.target.checked) {
      setIndexStart(pendingIndexStart); // initialize indexStart with pending on enable
    }
  }

  // Update indexStart only when user clicks Update button
  function handleUpdateClick() {
    if (pendingIndexStart < 1) {
      setPendingIndexStart(1);
      setIndexStart(1);
    } else {
      setIndexStart(pendingIndexStart);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Data Cleanser - Hiking Trails</h1>
      <FileUploader setRawRows={setRawRows} />

      {rawRows.length > 0 && (
        <div
          style={{
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <label
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={includeIndex}
              onChange={toggleIncludeIndex}
            />
            Index Start at:
          </label>

          {includeIndex && (
            <>
              <input
                type="number"
                min={1}
                value={pendingIndexStart}
                onChange={(e) => setPendingIndexStart(Number(e.target.value) || 1)}
                style={{ width: 50 }}
              />
              <button onClick={handleUpdateClick}>Update</button>
            </>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <DataGridWrapper rows={rows} initialColumns={initialColumns} />
      )}
    </div>
  );
}
