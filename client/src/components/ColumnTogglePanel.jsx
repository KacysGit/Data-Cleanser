// client/src/components/ColumnTogglePanel.jsx
import React from 'react';
import { CLEANING_COLUMNS } from '../../constants/cleaningColumns';

export default function ColumnTogglePanel({
  allColumnKeys,
  visibleCols,
  includeIndex,
  pendingIndexStart,
  toggleColumn,
  setIncludeIndex,
  setPendingIndexStart,
  handleUpdateClick,
  showAll,
  hideAll,
  // Cleaning columns state and setters:
  includeFlagged,
  setIncludeFlagged,
  includeResolved,
  setIncludeResolved,
  includeNotes,
  setIncludeNotes,
  includeFlaggedFor,
  setIncludeFlaggedFor,
  // Cleaning columns show/hide all handlers
  showAllCleaning,
  hideAllCleaning
}) {
  const cleaningKeys = CLEANING_COLUMNS;

  function toggleIncludeIndex(e) {
    setIncludeIndex(e.target.checked);
    if (e.target.checked) handleUpdateClick();
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: '#f4f4f4',
        padding: '10px 15px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: 60,
        flexWrap: 'wrap'
      }}
    >
      {/* MY COLUMNS */}
      <div>
        <strong>My Columns</strong>
        <div style={{ marginTop: 5 }}>
          <button onClick={showAll}>Show All</button>
          <button onClick={hideAll} style={{ marginLeft: 5 }}>
            Hide All
          </button>
        </div>
        <div style={{ marginTop: 5 }}>
          {allColumnKeys
            .filter(
              (key) =>
                key !== 'idx' &&
                !cleaningKeys.includes(key)
            )
            .map((key) => (
              <label key={key} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={visibleCols.includes(key)}
                  onChange={() => toggleColumn(key)}
                />
                {key}
              </label>
            ))}
        </div>
      </div>

      {/* CLEANING COLUMNS */}
      <div>
        <strong>Cleaning Columns</strong>
        <div style={{ marginTop: 5 }}>
          {/* Show/Hide All first */}
          <div style={{ marginBottom: 10 }}>
            <button onClick={showAllCleaning}>Show All</button>
            <button onClick={hideAllCleaning} style={{ marginLeft: 5 }}>
              Hide All
            </button>
          </div>

          {/* Then Index toggle */}
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={includeIndex}
              onChange={toggleIncludeIndex}
            />{' '}
            Index
          </label>
          {includeIndex && (
            <div style={{ marginTop: 4 }}>
              Start at:{' '}
              <input
                type="number"
                min={1}
                value={pendingIndexStart}
                onChange={(e) =>
                  setPendingIndexStart(Number(e.target.value) || 1)
                }
                style={{ width: 50, marginRight: 5 }}
              />
              <button onClick={handleUpdateClick}>Update</button>
            </div>
          )}

          {/* Now show the other checkboxes */}
          {cleaningKeys.map((key) => {
            const includeMap = {
              flagged: includeFlagged,
              resolved: includeResolved,
              notes: includeNotes,
              flaggedFor: includeFlaggedFor
            };
            const setIncludeMap = {
              flagged: setIncludeFlagged,
              resolved: setIncludeResolved,
              notes: setIncludeNotes,
              flaggedFor: setIncludeFlaggedFor
            };

            return (
              <label key={key} style={{ display: 'block', marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={includeMap[key]}
                  onChange={() => setIncludeMap[key]((v) => !v)}
                />{' '}
                {key}
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
}
