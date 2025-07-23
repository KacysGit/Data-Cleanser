// client/src/hooks/useRawData.js
import { useState } from 'react';

export default function useRawData() {
  const [rawRows, setRawRows] = useState([]);
  return { rawRows, setRawRows };
}