// client/src/components/EditablePopup.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function EditablePopup({ value, onSave, onClose, position }) {
  const [editedValue, setEditedValue] = useState(value || '');
  const popupRef = useRef(null);
  const textareaRef = useRef(null);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [popupPosition, setPopupPosition] = useState(position);

  const [size, setSize] = useState({ width: 300, height: 200 });
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSave(editedValue);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editedValue, onClose, onSave]);

  // Drag logic
  const onMouseDownHeader = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragOffset({
      x: e.clientX - popupPosition.left,
      y: e.clientY - popupPosition.top,
    });
  };

  // Resize logic
  const onMouseDownResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  const onMouseMove = (e) => {
    if (dragging) {
      setPopupPosition({
        top: e.clientY - dragOffset.y,
        left: e.clientX - dragOffset.x,
      });
    } else if (resizing) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSize({
        width: Math.max(150, resizeStart.current.width + dx),
        height: Math.max(100, resizeStart.current.height + dy),
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  const popupStyle = {
    position: 'absolute',
    top: popupPosition.top,
    left: popupPosition.left,
    width: size.width,
    height: size.height,
    background: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    resize: 'none',
  };

  const headerStyle = {
    background: '#f4f4f4',
    padding: '6px 10px',
    cursor: 'move',
    userSelect: 'none',
    fontWeight: 'bold',
    borderBottom: '1px solid #ccc',
  };

  const contentStyle = {
    flex: 1,
    padding: '10px',
    overflow: 'auto',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px',
    borderTop: '1px solid #ccc',
    gap: '8px',
  };

  const resizeHandleStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    background: '#ddd',
    cursor: 'se-resize',
  };

  return (
    <div ref={popupRef} style={popupStyle}>
      <div style={headerStyle} onMouseDown={onMouseDownHeader}>
        Edit Cell
      </div>
      <div style={contentStyle}>
        <textarea
          ref={textareaRef}
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        />
      </div>
      <div style={footerStyle}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={() => onSave(editedValue)}>Save</button>
      </div>
      <div style={resizeHandleStyle} onMouseDown={onMouseDownResize} />
    </div>
  );
}
