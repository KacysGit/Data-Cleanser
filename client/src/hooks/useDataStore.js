// client/hooks/useDataStore.js
import { useState, useEffect } from 'react';
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

export default function useDataStore() {
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);

  // Index column controls
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [pendingIndexStart, setPendingIndexStart] = useState(1);

  // New: Include flags for each cleaning column
  const [includeFlagged, setIncludeFlagged] = useState(true);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeFlaggedFor, setIncludeFlaggedFor] = useState(true);

  // Columns from user file
  const [visibleCols, setVisibleCols] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Load saved states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dataCache');
    if (saved) {
      const {
        rawRows,
        includeIndex,
        indexStart,
        includeFlagged,
        includeResolved,
        includeNotes,
        includeFlaggedFor
      } = JSON.parse(saved);
      setRawRows(rawRows || []);
      setIncludeIndex(includeIndex ?? false);
      setIndexStart(indexStart || 1);
      setPendingIndexStart(indexStart || 1);
      setIncludeFlagged(includeFlagged ?? true);
      setIncludeResolved(includeResolved ?? true);
      setIncludeNotes(includeNotes ?? true);
      setIncludeFlaggedFor(includeFlaggedFor ?? true);
    }
  }, []);

  // Save states to localStorage on changes
  useEffect(() => {
    if (rawRows.length) {
      localStorage.setItem(
        'dataCache',
        JSON.stringify({
          rawRows,
          includeIndex,
          indexStart,
          includeFlagged,
          includeResolved,
          includeNotes,
          includeFlaggedFor
        })
      );
    }
  }, [
    rawRows,
    includeIndex,
    indexStart,
    includeFlagged,
    includeResolved,
    includeNotes,
    includeFlaggedFor
  ]);

  // Build rows, adding index and cleaning columns if included
  useEffect(() => {
    const baseRows = rawRows.map((row, i) => ({ ...row }));

    if (includeIndex) {
      baseRows.forEach((r, i) => {
        r.idx = i + indexStart;
      });
    } else {
      baseRows.forEach((r) => {
        delete r.idx;
      });
    }

    // Add default cleaning columns if included
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

  // Determine user columns (from uploaded file)
  useEffect(() => {
    if (rawRows.length) {
      const userKeys = Object.keys(rawRows[0]);
      setVisibleCols(userKeys);
    }
  }, [rawRows]);

  // Combine all columns for the grid based on visibility and include flags
  const allColumnKeys = rows.length ? Object.keys(rows[0]) : [];

  // Build final list of columns keys to show
  const filteredColumns = allColumnKeys.filter((key) => {
    // Show if it's a user column and visible
    if (visibleCols.includes(key)) return true;

    // Show if index and included
    if (key === 'idx' && includeIndex) return true;

    // Show cleaning columns only if their include flag is true
    if (key === 'flagged' && includeFlagged) return true;
    if (key === 'resolved' && includeResolved) return true;
    if (key === 'notes' && includeNotes) return true;
    if (key === 'flaggedFor' && includeFlaggedFor) return true;

    return false;
  });

  // Build column definitions with display names etc.
  const initialColumns = filteredColumns.map((key) => {
    let name = key;
    switch (key) {
      case 'idx':
        name = 'Index';
        break;
      case 'flagged':
        name = 'Flagged';
        break;
      case 'resolved':
        name = 'Resolved';
        break;
      case 'notes':
        name = 'Notes';
        break;
      case 'flaggedFor':
        name = 'Flagged For';
        break;
      default:
        // Capitalize first letter for user columns
        name = key.charAt(0).toUpperCase() + key.slice(1);
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
    setIncludeFlagged(true);
    setIncludeResolved(true);
    setIncludeNotes(true);
    setIncludeFlaggedFor(true);
    localStorage.removeItem('dataCache');
    setFileInputKey(Date.now());
  }

  console.log('useDataStore clearData:', clearData);

  return {
    rawRows,
    rows,
    setRawRows,
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
    clearData,
    fileInputKey
  };
}
