// client/App.jsx
import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataGridWrapper from './components/DataGridWrapper';
import ColumnTogglePanel from './components/ColumnTogglePanel';
import Toolbar from './components/Toolbar';
import useDataStore from './hooks/useDataStore';
import './styles/globals.css';

export default function App() {
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [savedMessageVisible, setSavedMessageVisible] = useState(false);
  const store = useDataStore();

  const handleSave = () => {
    store.updateRows(store.rows);
    store.flushSave();
    setSavedMessageVisible(true);
    setTimeout(() => setSavedMessageVisible(false), 2000);
  };

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <h1>Data Cleanser</h1>
      <p>Data Cleaning Has Never Been So Easy</p>

      <FileUploader setRawRows={store.setRawRows} key={store.fileInputKey} />

      {store.rows.length > 0 && (
        <>
          <Toolbar
            onTogglePanel={() => setShowColumnPanel((v) => !v)}
            panelOpen={showColumnPanel}
            onClear={store.clearData}
            onSave={handleSave}
          />

          {savedMessageVisible && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                background: '#4caf50',
                color: 'white',
                padding: '6px 12px',
                borderRadius: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                transition: 'opacity 0.3s',
                zIndex: 1000
              }}
            >
              Saved!
            </div>
          )}

          {showColumnPanel && (
            <ColumnTogglePanel
              allColumnKeys={store.rows.length ? Object.keys(store.rows[0]) : []}
              visibleCols={store.visibleCols}
              includeIndex={store.includeIndex}
              pendingIndexStart={store.pendingIndexStart}
              toggleColumn={store.toggleColumn}
              setIncludeIndex={store.setIncludeIndex}
              setPendingIndexStart={store.setPendingIndexStart}
              handleUpdateClick={store.handleUpdateClick}
              showAll={store.showAll}
              hideAll={store.hideAll}
              includeFlagged={store.includeFlagged}
              setIncludeFlagged={store.setIncludeFlagged}
              includeResolved={store.includeResolved}
              setIncludeResolved={store.setIncludeResolved}
              includeNotes={store.includeNotes}
              setIncludeNotes={store.setIncludeNotes}
              includeFlaggedFor={store.includeFlaggedFor}
              setIncludeFlaggedFor={store.setIncludeFlaggedFor}
              showAllCleaning={store.showAllCleaning}
              hideAllCleaning={store.hideAllCleaning}
            />
          )}

          <DataGridWrapper
            rows={store.rows}
            initialColumns={store.initialColumns}
            updateRows={store.updateRows}
          />
        </>
      )}
    </div>
  );
}
