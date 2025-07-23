// client/components/Toolbar.jsx
import React from 'react';
import ClearDataButton from './ClearDataButton';

export default function Toolbar({ onTogglePanel, panelOpen, onClear, onSave }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
      <button
        onClick={onTogglePanel}
        style={{
          backgroundColor: panelOpen ? '#ddd' : undefined
        }}
      >
        Toggle Columns
      </button>

      <ClearDataButton onClear={onClear} />

      <button onClick={onSave}>Save Changes</button>
    </div>
  );
}
