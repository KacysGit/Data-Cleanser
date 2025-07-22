import { useState, useEffect } from 'react';

export default function useDataStore() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);
  const [visibleCols, setVisibleCols] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    const saved = localStorage.getItem('dataCache');
    if (saved) {
      const { rawRows, includeIndex, indexStart } = JSON.parse(saved);
      setRawRows(rawRows || []);
      setIncludeIndex(includeIndex || false);
      setIndexStart(indexStart || 1);
      setPendingIndexStart(indexStart || 1);
    }
  }, []);

  useEffect(() => {
    if (rawRows.length) {
      localStorage.setItem(
        'dataCache',
        JSON.stringify({ rawRows, includeIndex, indexStart })
      );
    }
  }, [rawRows, includeIndex, indexStart]);

  useEffect(() => {
    const updated = includeIndex
      ? rawRows.map((row, i) => ({ idx: i + indexStart, ...row }))
      : rawRows;
    setRows(updated);
  }, [rawRows, includeIndex, indexStart]);

  useEffect(() => {
    if (rawRows.length) {
      const keys = Object.keys(rawRows[0]);
      setVisibleCols(keys);
    }
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
    setIndexStart(Math.max(1, pendingIndexStart));
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

  function clearData() {
    setRawRows([]);
    setRows([]);
    setVisibleCols([]);
    setIncludeIndex(false);
    setIndexStart(1);
    setPendingIndexStart(1);
    localStorage.removeItem('dataCache');
    setFileInputKey(Date.now());
  }

  return {
    rawRows,
    rows,
    setRawRows,
    includeIndex,
    setIncludeIndex,
    indexStart,
    pendingIndexStart,
    setPendingIndexStart,
    handleUpdateClick,
    initialColumns,
    visibleCols,
    toggleColumn,
    showAll,
    hideAll,
    clearData,
    fileInputKey
  };
}
