// client/src/hooks/useColumnDefs.js
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

export default function useColumnDefs(rows, {
  includeIndex,
  includeFlagged,
  includeResolved,
  includeNotes,
  includeFlaggedFor,
  visibleCols
}) {
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

  return filteredColumns.map((key) => {
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
}