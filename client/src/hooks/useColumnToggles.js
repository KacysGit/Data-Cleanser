// client/src/hooks/useColumnToggles.js
import { useState, useEffect, useRef } from 'react';
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

export default function useColumnToggles(rawRows) {
  const [includeIndex, setIncludeIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);  // <-- allow updating indexStart
  const [pendingIndexStart, setPendingIndexStart] = useState(1);

  const [includeFlagged, setIncludeFlagged] = useState(true);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeFlaggedFor, setIncludeFlaggedFor] = useState(true);

  const [visibleCols, setVisibleCols] = useState([]);
  const [allUserColumnKeys, setAllUserColumnKeys] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && rawRows.length) {
      const userKeys = Object.keys(rawRows[0]).filter(
        (key) => !CLEANING_COLUMNS.includes(key) && key !== 'idx'
      );
      setVisibleCols(userKeys);
      setAllUserColumnKeys(userKeys);
      initialized.current = true;
    }
  }, [rawRows]);

  function toggleColumn(key) {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function showAll() {
    setVisibleCols(allUserColumnKeys);
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

  // This is the function <ColumnTogglePanel /> expects
  function handleUpdateClick(newStart) {
    if (newStart !== undefined) {
      setIndexStart(newStart);
    } else {
      setIndexStart((s) => s); // triggers a re-render to update dependent values
    }
  }

  return {
    fileInputKey,
    setFileInputKey,
    includeIndex,
    setIncludeIndex,
    indexStart,
    setIndexStart,
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
    setVisibleCols,
    visibleCols,
    toggleColumn,
    showAll,
    hideAll,
    showAllCleaning,
    hideAllCleaning,
    allUserColumnKeys,
    handleUpdateClick,  // <-- added here
  };
}
