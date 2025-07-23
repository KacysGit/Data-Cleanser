// client/components/DataGridWrapper.jsx
import React, { useState } from 'react';
import { DataGrid } from 'react-data-grid';
import EditablePopup from './EditablePopup';

export default function DataGridWrapper({ rows, initialColumns, updateRows }) {
  const [popup, setPopup] = useState(null);

  function handleCellDoubleClick(args) {
    const { rowIdx, column } = args;
    const colKey = column.key;
    if (colKey === 'idx') return;

    if (colKey === 'flagged' || colKey === 'resolved') {
      const updated = [...rows];
      const newVal = !updated[rowIdx][colKey];
      updated[rowIdx][colKey] = newVal;

      if (colKey === 'resolved' && newVal === true) {
        updated[rowIdx].flagged = false;
      }

      updateRows(updated);
      return;
    }

    setPopup({
      rowIdx,
      colKey,
      value: rows[rowIdx][colKey]
    });
  }

  function handleSave(newValue) {
    const updated = [...rows];
    const key = popup.colKey;
    const val =
      key === 'flaggedFor' ? newValue.split(',').map((s) => s.trim()) : newValue;
    updated[popup.rowIdx][key] = val;
    updateRows(updated);
    setPopup(null);
  }

  const columns = initialColumns.map((col) => {
    if (col.key === 'flagged' || col.key === 'resolved') {
      return {
        ...col,
        formatter: ({ row }) => (
          <input type="checkbox" checked={!!row[col.key]} readOnly />
        )
      };
    }

    if (col.key === 'flaggedFor') {
      return {
        ...col,
        formatter: ({ row }) => row.flaggedFor?.join(', ')
      };
    }

    return col;
  });

  return (
    <div style={{ position: 'relative' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowHeight={40}
        className="fill-grid"
        defaultColumnOptions={{
          resizable: true,
          sortable: true
        }}
        onCellDoubleClick={handleCellDoubleClick}
      />
      {popup && (
        <EditablePopup
          value={popup.value}
          onSave={handleSave}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
