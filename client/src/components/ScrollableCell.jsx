import React from 'react';

export default function ScrollableCell({ row, column }) {
  const value = row[column.key];

  return (
    <div className="scrollable-cell" title={typeof value === 'string' ? value : ''}>
      {value}
    </div>
  );
}
