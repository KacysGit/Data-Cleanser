// src/App.jsx
// Description: React file uploader with fully working column resizing and scrollable cells

import React, { useState, useRef } from "react";
import Papa from "papaparse";

export default function App() {
  const [data, setData] = useState([]);
  const [colWidths, setColWidths] = useState({});
  const resizing = useRef({ col: null, startX: 0, startWidth: 0 });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data;
        setData(parsed);
        const keys = Object.keys(parsed[0] || {});
        const widths = {};
        keys.forEach((key) => (widths[key] = 200)); // default width
        setColWidths(widths);
      },
    });
  };

  const startResizing = (e, col) => {
    resizing.current = {
      col,
      startX: e.clientX,
      startWidth: colWidths[col],
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e) => {
    const { col, startX, startWidth } = resizing.current;
    const dx = e.clientX - startX;
    const newWidth = Math.max(80, startWidth + dx);

    setColWidths((prev) => ({
      ...prev,
      [col]: newWidth,
    }));
  };

  const stopResizing = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    resizing.current = { col: null, startX: 0, startWidth: 0 };
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Upload CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {data.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            <colgroup>
              {columns.map((col) => (
                <col
                  key={col}
                  style={{ width: `${colWidths[col] || 200}px` }}
                />
              ))}
            </colgroup>

            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      background: "#f3f3f3",
                      position: "relative",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                    <div
                      onMouseDown={(e) => startResizing(e, col)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "6px",
                        cursor: "col-resize",
                        zIndex: 10,
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      style={{
                        border: "1px solid #ccc",
                        padding: "0",
                        maxHeight: "100px",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                          overflowX: "auto",
                          padding: "6px 8px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {row[col]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
