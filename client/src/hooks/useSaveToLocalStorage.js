// client/src/hooks/useSaveToLocalStorage.js
import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

export default function useSaveToLocalStorage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);

  const save = useCallback(
    debounce((payload) => {
      localStorage.setItem('dataCache', JSON.stringify(payload));
    }, 500),
    []
  );

  function flushSave() {
    save.flush();
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
  }

  useEffect(() => {
    const handler = (e) => {
      if (!hasUnsavedChangesRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  return { hasUnsavedChanges, setHasUnsavedChanges, save, flushSave };
}