// client/src/hooks/useDataStore.js
import useRawData from './useRawData';
import useColumnToggles from './useColumnToggles';
import useSaveToLocalStorage from './useSaveToLocalStorage';
import useColumnDefs from './useColumnDefs';
import { transformRows } from '../utils/transformRows';
import { useEffect, useState } from 'react';

export default function useDataStore() {
  const { rawRows, setRawRows } = useRawData();
  const toggles = useColumnToggles(rawRows);
  const { hasUnsavedChanges, setHasUnsavedChanges, save, flushSave } = useSaveToLocalStorage();
  const [rows, setRows] = useState([]);

  // Destructure toggles props to use as dependencies
  const {
    fileInputKey,
    setFileInputKey,
    includeIndex,
    indexStart,
    includeFlagged,
    includeResolved,
    includeNotes,
    includeFlaggedFor,
    visibleCols,
    setVisibleCols
  } = toggles;

  // Load saved data once on mount
  useEffect(() => {
    const saved = localStorage.getItem('dataCache');
    if (saved) {
      const parsed = JSON.parse(saved);
      setRawRows(parsed.rawRows || []);
      setRows(parsed.rows || []);
      if (parsed.visibleCols && typeof setVisibleCols === 'function') {
        setVisibleCols(parsed.visibleCols);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update transformed rows whenever rawRows or toggle options change
  useEffect(() => {
    const newRows = transformRows(rawRows, toggles);
    setRows(newRows);
  }, [
    rawRows,
    includeIndex,
    indexStart,
    includeFlagged,
    includeResolved,
    includeNotes,
    includeFlaggedFor,
    JSON.stringify(visibleCols)
  ]);

  // Replace rawRows and rows with newRows (no merge to avoid duplication)
  function updateRows(newRawRows) {
    console.log('updateRows called with keys:', Object.keys(newRawRows[0] || {}));
    setRawRows(newRawRows); // Save full raw data including all columns
    const transformed = transformRows(newRawRows, toggles); // Apply visibleCols + toggles for UI
    setRows(transformed);
    setHasUnsavedChanges(true);
    save({
      rawRows: newRawRows,    // Save the full raw rows with hidden columns intact
      rows: transformed,      // The transformed rows for display
      ...toggles,
    });
  }


  // Clears all data and localStorage cache
  function clearData() {
    setRawRows([]);
    setRows([]);
    if (typeof setVisibleCols === 'function') {
      setVisibleCols([]);
    }
    localStorage.removeItem('dataCache');
    setHasUnsavedChanges(false);
    setFileInputKey(Date.now());

  }

  // Re-apply transform and update rows (for example, after toggle changes)
  function handleUpdateClick() {
    const newRows = transformRows(rawRows, toggles);
    setRows(newRows);
  }

  const initialColumns = useColumnDefs(rows, toggles);

  return {
    fileInputKey,
    rawRows,
    setRawRows,
    rows,
    updateRows,
    flushSave,
    clearData,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    initialColumns,
    handleUpdateClick,
    ...toggles
  };
}
