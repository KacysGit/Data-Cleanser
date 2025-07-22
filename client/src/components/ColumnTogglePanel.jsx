import React from 'react';

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
  hideAll
}) {
  function toggleIncludeIndex(e) {
    setIncludeIndex(e.target.checked);
    if (e.target.checked) {
      handleUpdateClick(); // Sync indexStart immediately
    }
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
        gap: 30,
        flexWrap: 'wrap'
      }}
    >
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
            .filter((key) => key !== 'idx')
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

      <div>
        <label>
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
      </div>
    </div>
  );
}
