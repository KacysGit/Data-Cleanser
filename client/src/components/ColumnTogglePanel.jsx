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

  // Toggle index and immediately call handleUpdateClick if enabling index
  function toggleIncludeIndex(e) {
    setIncludeIndex(e.target.checked);
    if (e.target.checked) handleUpdateClick();
  }

  // Increment index start and immediately update
  function incrementIndex() {
    const newVal = (pendingIndexStart || 1) + 1;
    setPendingIndexStart(newVal);
    handleUpdateClick(newVal);
  }

  // Decrement index start and immediately update
  function decrementIndex() {
    const newVal = Math.max(1, (pendingIndexStart || 1) - 1);
    setPendingIndexStart(newVal);
    handleUpdateClick(newVal);
  }

  // On input change, update pendingIndexStart but do NOT call handleUpdateClick yet
  function onInputChange(e) {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setPendingIndexStart(val === '' ? '' : Number(val));
    }
  }

  // On input blur, validate and immediately update
  function onInputBlur() {
    let newVal = Number(pendingIndexStart);
    if (isNaN(newVal) || newVal < 1) {
      newVal = 1;
    }
    setPendingIndexStart(newVal);
    handleUpdateClick(newVal);
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
            .filter((key) => key !== 'idx' && !cleaningKeys.includes(key))
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
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
              Start at:{' '}
              <button type="button" onClick={decrementIndex} aria-label="Decrease index start">
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pendingIndexStart}
                onChange={onInputChange}
                onBlur={onInputBlur}
                style={{ width: 50, marginRight: 5, textAlign: 'center' }}
                aria-label="Index start input"
              />
              <button type="button" onClick={incrementIndex} aria-label="Increase index start">
                +
              </button>
              {/* Removed Update button as requested */}
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
