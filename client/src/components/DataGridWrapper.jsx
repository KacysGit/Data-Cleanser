import React, { useRef, useState, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import EditablePopup from './EditablePopup';

export default function DataGridWrapper({ rows, initialColumns }) {
  const [data, setData] = useState(rows);
  const [popup, setPopup] = useState(null);
  const gridRef = useRef(null);

  // Keep internal data in sync with prop
  useEffect(() => {
    setData(rows);
  }, [rows]);

  function handleCellDoubleClick(args, event) {
    const { rowIdx, column } = args;
    if (column.key === 'idx') return; // 🔒 Disable editing for index column

    const cell = event.currentTarget;
    const rect = cell.getBoundingClientRect();

    const position = {
      top: rect.top + window.scrollY + rect.height,
      left: rect.left + window.scrollX
    };

    setPopup({
      rowIdx,
      colKey: column.key,
      value: data[rowIdx][column.key],
      position
    });
  }

  function handleSave(newValue) {
    const updated = [...data];
    updated[popup.rowIdx][popup.colKey] = newValue;
    setData(updated);
    setPopup(null);
  }

  const columns = initialColumns.map((col) => ({
    ...col,
    resizable: true,
    sortable: true
  }));

  return (
    <div style={{ position: 'relative' }} ref={gridRef}>
      <DataGrid
        columns={columns}
        rows={data}
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
          position={popup.position}
        />
      )}
    </div>
  );
}
