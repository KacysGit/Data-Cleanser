import React from 'react';

export default function ClearDataButton({ onClear }) {
  function handleClick() {
    const confirmed = window.confirm('Are you sure you want to remove all data?');
    if (confirmed) {
      onClear();
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{ backgroundColor: '#fdd', color: '#900' }}
    >
      Remove All Data
    </button>
  );
}
