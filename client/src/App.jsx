import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import DataGridWrapper from './components/DataGridWrapper';
import ColumnTogglePanel from './components/ColumnTogglePanel';
import './styles/globals.css';

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [visibleCols, setVisibleCols] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // 🔁 key to reset input

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('dataCache');
    if (savedData) {
      const { rawRows, includeIndex, indexStart } = JSON.parse(savedData);
      setRawRows(rawRows || []);
      setIncludeIndex(includeIndex || false);
      setIndexStart(indexStart || 1);
      setPendingIndexStart(indexStart || 1);
    }
  }, []);

  // Cache data to localStorage
  useEffect(() => {
    if (rawRows.length) {
      localStorage.setItem(
        'dataCache',
        JSON.stringify({ rawRows, includeIndex, indexStart })
      );
    }
  }, [rawRows, includeIndex, indexStart]);

  useEffect(() => {
    if (!rawRows.length) {
      setRows([]);
      return;
    }

    const updated = includeIndex
      ? rawRows.map((row, i) => ({ idx: i + indexStart, ...row }))
      : rawRows;

    setRows(updated);
  }, [rawRows, includeIndex, indexStart]);

  // Always reset visible columns from rawRows
  useEffect(() => {
    const keys = rawRows.length ? Object.keys(rawRows[0]) : [];
    setVisibleCols(keys);
  }, [rawRows]);

  const allColumnKeys = rows.length ? Object.keys(rows[0]) : [];

  const filteredColumns = allColumnKeys.filter(
    (key) => visibleCols.includes(key) || (includeIndex && key === 'idx')
  );

  const initialColumns = filteredColumns.map((key) => ({
    key,
    name: key === 'idx' ? 'Index' : key.charAt(0).toUpperCase() + key.slice(1),
    width: key === 'idx' ? 80 : 150,
    editable: key !== 'idx',
    resizable: true,
    sortable: true
  }));

  function handleUpdateClick() {
    if (pendingIndexStart < 1) {
      setPendingIndexStart(1);
      setIndexStart(1);
    } else {
      setIndexStart(pendingIndexStart);
    }
  }

  function toggleColumn(key) {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function showAll() {
    setVisibleCols(allColumnKeys);
  }

  function hideAll() {
    setVisibleCols([]);
  }

  function handleClearData() {
    const confirmed = window.confirm('Are you sure you want to remove all data?');
    if (confirmed) {
      setRawRows([]);
      setRows([]);
      setVisibleCols([]);
      setIncludeIndex(false);
      setIndexStart(1);
      setPendingIndexStart(1);
      localStorage.removeItem('dataCache');
      setFileInputKey(Date.now()); // 🔁 reset file input
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Data Cleanser</h1>
      <p>Data Cleaning Has Never Been So Easy</p>
      <FileUploader setRawRows={setRawRows} key={fileInputKey} />

      {rows.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button
              onClick={() => setShowColumnPanel(!showColumnPanel)}
              style={{
                backgroundColor: showColumnPanel ? '#ddd' : undefined
              }}
            >
              Toggle Columns
            </button>

            <button
              onClick={handleClearData}
              style={{ backgroundColor: '#fdd', color: '#900' }}
            >
              Remove All Data
            </button>
          </div>

          {showColumnPanel && (
            <ColumnTogglePanel
              allColumnKeys={allColumnKeys}
              visibleCols={visibleCols}
              includeIndex={includeIndex}
              pendingIndexStart={pendingIndexStart}
              toggleColumn={toggleColumn}
              setIncludeIndex={setIncludeIndex}
              setPendingIndexStart={setPendingIndexStart}
              handleUpdateClick={handleUpdateClick}
              showAll={showAll}
              hideAll={hideAll}
            />
          )}

          <DataGridWrapper rows={rows} initialColumns={initialColumns} />
        </>
      )}
    </div>
  );
}
