//client/src/hooks/useDataStore.js
import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

export default function useDataStore() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);

  // Index column controls
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);

  // Cleaning column visibility flags
  const [includeFlagged, setIncludeFlagged] = useState(true);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeFlaggedFor, setIncludeFlaggedFor] = useState(true);

  // User-uploaded columns visibility
  const [visibleCols, setVisibleCols] = useState([]);
  const [fileInputKey] = useState(Date.now());

  // Unsaved change detection
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);

  // Load saved states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dataCache');
    if (saved) {
      const {
        rawRows: savedRawRows,
        rows: savedRows,
        includeIndex,
        indexStart,
        includeFlagged,
        includeResolved,
        includeNotes,
        includeFlaggedFor,
        visibleCols
      } = JSON.parse(saved);

      setRawRows(savedRawRows || []);
      setRows(savedRows || []);
      setIncludeIndex(includeIndex ?? false);
      setIndexStart(indexStart || 1);
      setPendingIndexStart(indexStart || 1);
      setIncludeFlagged(includeFlagged ?? true);
      setIncludeResolved(includeResolved ?? true);
      setIncludeNotes(includeNotes ?? true);
      setIncludeFlaggedFor(includeFlaggedFor ?? true);
      setVisibleCols(visibleCols || []);
    }
  }, []);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!hasUnsavedChangesRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((rowsToSave) => {
      localStorage.setItem(
        'dataCache',
        JSON.stringify({
          rawRows,
          rows: rowsToSave,
          includeIndex,
          indexStart,
          includeFlagged,
          includeResolved,
          includeNotes,
          includeFlaggedFor,
          visibleCols,
        })
      );
    }, 500),
    [rawRows, includeIndex, indexStart, includeFlagged, includeResolved, includeNotes, includeFlaggedFor, visibleCols]
  );

  // Update rows state and flag unsaved changes
  function updateRows(newRows) {
    setRows(newRows);
    setRawRows(newRows);
    setHasUnsavedChanges(true);
    hasUnsavedChangesRef.current = true;
    debouncedSave(newRows);
  }

  // Rebuild rows when display settings change
  useEffect(() => {
    const baseRows = rawRows.map((row) => ({ ...row }));

    if (includeIndex) {
      baseRows.forEach((r, i) => {
        r.idx = i + indexStart;
      });
    } else {
      baseRows.forEach((r) => {
        delete r.idx;
      });
    }

    baseRows.forEach((r) => {
      if (includeFlagged && r.flagged === undefined) r.flagged = false;
      else if (!includeFlagged) delete r.flagged;

      if (includeResolved && r.resolved === undefined) r.resolved = false;
      else if (!includeResolved) delete r.resolved;

      if (includeNotes && r.notes === undefined) r.notes = '';
      else if (!includeNotes) delete r.notes;

      if (includeFlaggedFor && r.flaggedFor === undefined) r.flaggedFor = [];
      else if (!includeFlaggedFor) delete r.flaggedFor;
    });

    setRows(baseRows);
  }, [
    rawRows,
    includeIndex,
    indexStart,
    includeFlagged,
    includeResolved,
    includeNotes,
    includeFlaggedFor
  ]);

  // Determine visible columns
  useEffect(() => {
    if (rawRows.length) {
      const userKeys = Object.keys(rawRows[0]);
      setVisibleCols(userKeys);
    }
  }, [rawRows]);

  const allColumnKeys = rows.length ? Object.keys(rows[0]) : [];

  let filteredColumns = allColumnKeys.filter((key) => {
    if (key === 'idx') return includeIndex;
    if (CLEANING_COLUMNS.includes(key)) {
      if (key === 'flagged') return includeFlagged;
      if (key === 'resolved') return includeResolved;
      if (key === 'notes') return includeNotes;
      if (key === 'flaggedFor') return includeFlaggedFor;
      return false;
    }
    return visibleCols.includes(key);
  });

  if (includeIndex && filteredColumns.includes('idx')) {
    filteredColumns = ['idx', ...filteredColumns.filter((k) => k !== 'idx')];
  }

  const initialColumns = filteredColumns.map((key) => {
    let name = key;
    switch (key) {
      case 'idx': name = 'Index'; break;
      case 'flagged': name = 'Flagged'; break;
      case 'resolved': name = 'Resolved'; break;
      case 'notes': name = 'Notes'; break;
      case 'flaggedFor': name = 'Flagged For'; break;
      default: name = key.charAt(0).toUpperCase() + key.slice(1);
    }

    return {
      key,
      name,
      width: key === 'idx' ? 80 : 150,
      editable: key !== 'idx',
      resizable: true,
      sortable: true
    };
  });

  function showAll() {
    const userCols = rawRows.length ? Object.keys(rawRows[0]) : [];
    setVisibleCols(userCols);
  }

  function hideAll() {
    setVisibleCols([]);
  }

  function showAllCleaning() {
    setIncludeIndex(true);
    setIncludeFlagged(true);
    setIncludeResolved(true);
    setIncludeNotes(true);
    setIncludeFlaggedFor(true);
  }

  function hideAllCleaning() {
    setIncludeIndex(false);
    setIncludeFlagged(false);
    setIncludeResolved(false);
    setIncludeNotes(false);
    setIncludeFlaggedFor(false);
  }

  function toggleColumn(key) {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handleUpdateClick(newIndexStart) {
    if (newIndexStart !== undefined) {
      setIndexStart(Math.max(1, newIndexStart));
    } else {
      setIndexStart(Math.max(1, pendingIndexStart));
    }
  }

  function clearData() {
    setRawRows([]);
    setRows([]);
    setVisibleCols([]);
    localStorage.removeItem('dataCache');
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
  }

  function flushSave() {
    debouncedSave.flush();
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
  }

  return {
    rawRows,
    rows,
    setRawRows,
    updateRows,
    flushSave,
    includeIndex,
    setIncludeIndex,
    indexStart,
    pendingIndexStart,
    setPendingIndexStart,
    includeFlagged,
    setIncludeFlagged,
    includeResolved,
    setIncludeResolved,
    includeNotes,
    setIncludeNotes,
    includeFlaggedFor,
    setIncludeFlaggedFor,
    handleUpdateClick,
    initialColumns,
    visibleCols,
    toggleColumn,
    showAll,
    hideAll,
    showAllCleaning,
    hideAllCleaning,
    fileInputKey,
    clearData,
    hasUnsavedChanges,
    setHasUnsavedChanges
  };
}
