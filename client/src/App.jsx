import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import DataGridWrapper from './components/DataGridWrapper';

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);

  useEffect(() => {
    if (!rawRows.length) {
      setRows([]);
      return;
    }
    if (includeIndex) {
      const newRows = rawRows.map((row, i) => ({
        idx: i + indexStart,
        ...row,
      }));
      setRows(newRows);
    } else {
      setRows(rawRows);
    }
  }, [rawRows, includeIndex, indexStart]);

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

  function toggleIncludeIndex(e) {
    setIncludeIndex(e.target.checked);
    if (e.target.checked) {
      setIndexStart(pendingIndexStart);
    }
  }

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
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={includeIndex}
              onChange={toggleIncludeIndex}
            />
            Index
            {includeIndex && (
              <>
                <span>&nbsp;Start at:</span>
                <input
                  type="number"
                  min={1}
                  value={pendingIndexStart}
                  onChange={(e) =>
                    setPendingIndexStart(Number(e.target.value) || 1)
                  }
                  style={{ width: 50 }}
                />
                <button onClick={handleUpdateClick}>Update</button>
              </>
            )}
          </label>
        </div>
      )}

      {rows.length > 0 && (
        <DataGridWrapper rows={rows} initialColumns={initialColumns} />
      )}
    </div>
  );
}
