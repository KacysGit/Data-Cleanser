// src/App.jsx
// Main React component with scrollable cells and resizable columns

import React, { useState, useRef } from "react";
import Papa from "papaparse";

export default function App() {
  const [data, setData] = useState([]);
  const [colWidths, setColWidths] = useState({}); // Track widths per column
  const tableRef = useRef(null);
  const resizingCol = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);

        // Reset col widths on new data load
        if (results.data.length > 0) {
          const keys = Object.keys(results.data[0]);
          const initialWidths = {};
          keys.forEach(key => {
            initialWidths[key] = 150; // default 150px width
          });
          setColWidths(initialWidths);
        }
      },
    });
  };

  // Mouse down on resizer handle
  const onMouseDown = (e, colName) => {
    resizingCol.current = colName;
    startX.current = e.clientX;
    startWidth.current = colWidths[colName] || 150;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Mouse move to resize
  const onMouseMove = (e) => {
    if (!resizingCol.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + deltaX); // min 50px
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current]: newWidth,
    }));
  };

  // Mouse up stops resizing
  const onMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Upload CSV File</h1>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table
          ref={tableRef}
          style={{
            borderCollapse: "collapse",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <thead>
            <tr>
              {columns.map((colName) => (
                <th
                  key={colName}
                  style={{
                    border: "1px solid #ccc",
                    position: "relative",
                    width: colWidths[colName],
                    minWidth: 50,
                    userSelect: "none",
                    padding: "8px",
                    backgroundColor: "#eee",
                  }}
                >
                  {colName}
                  {/* Resize handle */}
                  <div
                    onMouseDown={(e) => onMouseDown(e, colName)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: "6px",
                      cursor: "col-resize",
                      userSelect: "none",
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ border: "1px solid #ccc" }}>
                {columns.map((colName, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      border: "1px solid #ccc",
                      maxWidth: colWidths[colName],
                      maxHeight: 100,
                      overflowY: "auto",
                      whiteSpace: "normal",
                      padding: "6px 8px",
                      verticalAlign: "top",
                    }}
                  >
                    {row[colName]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
