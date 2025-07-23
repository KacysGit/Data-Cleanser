// client/src/utils/transformRows.js
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

/**
 * Transforms raw data rows by:
 * - Adding an index column if requested
 * - Ensuring cleaning columns have default values or are removed
 * - Filtering columns based on visibility flags
 *
 * @param {Array} rawRows - The original array of data objects
 * @param {Object} options - Options controlling transformations
 * @param {boolean} options.includeIndex - Whether to add 'idx' column
 * @param {number} options.indexStart - Starting number for index
 * @param {boolean} options.includeFlagged
 * @param {boolean} options.includeResolved
 * @param {boolean} options.includeNotes
 * @param {boolean} options.includeFlaggedFor
 * @param {Array} options.visibleCols - Array of visible user columns
 * @returns {Array} Transformed array of data objects
 */
export function transformRows(
  rawRows,
  {
    includeIndex = false,
    indexStart = 1,
    includeFlagged = true,
    includeResolved = true,
    includeNotes = true,
    includeFlaggedFor = true,
    visibleCols = [],
  } = {}
) {
  let transformed = rawRows.map((row, i) => {
    const newRow = { ...row };

    // Handle index column
    if (includeIndex) {
      newRow.idx = i + indexStart;
    } else {
      delete newRow.idx;
    }

    // Cleaning columns handling with default values or removal
    if (includeFlagged) {
      if (newRow.flagged === undefined) newRow.flagged = false;
    } else {
      delete newRow.flagged;
    }

    if (includeResolved) {
      if (newRow.resolved === undefined) newRow.resolved = false;
    } else {
      delete newRow.resolved;
    }

    if (includeNotes) {
      if (newRow.notes === undefined) newRow.notes = '';
    } else {
      delete newRow.notes;
    }

    if (includeFlaggedFor) {
      if (newRow.flaggedFor === undefined) newRow.flaggedFor = [];
    } else {
      delete newRow.flaggedFor;
    }

    // Filter out keys not included in visibleCols or cleaning columns if not included
    const filteredRow = {};
    Object.keys(newRow).forEach((key) => {
      const isCleaningColumn = CLEANING_COLUMNS.includes(key);
      if (
        (includeIndex && key === 'idx') ||
        (isCleaningColumn && (
          (key === 'flagged' && includeFlagged) ||
          (key === 'resolved' && includeResolved) ||
          (key === 'notes' && includeNotes) ||
          (key === 'flaggedFor' && includeFlaggedFor)
        )) ||
        visibleCols.includes(key)
      ) {
        filteredRow[key] = newRow[key];
      }
    });

    return filteredRow;
  });

  return transformed;
}
