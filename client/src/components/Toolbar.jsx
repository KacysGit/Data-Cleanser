// client/components/Toolbar.jsx
import React from 'react';

export default function Toolbar({ onTogglePanel, panelOpen, onClear, onSave, onExport }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={onTogglePanel}>
        {panelOpen ? 'Hide Columns' : 'Show Columns'}
      </button>

      <button onClick={onClear} style={{ marginLeft: 10 }}>
        Clear Data
      </button>

      <button onClick={onSave} style={{ marginLeft: 10 }}>
        Save Changes
      </button>

      <button onClick={onExport} style={{ marginLeft: 10 }}>
        Export CSV
      </button>
    </div>
  );
}
