// File: client/src/App.jsx
// Purpose: Root component with file upload and CSV display table

import React, { useState } from "react";

export default function App() {
  const [rows, setRows] = useState([]);

  // Handle CSV file upload and parsing
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.trim().split("\n");
    const parsedRows = lines.map((line) =>
      // Simple CSV split by commas — can improve later
      line.split(",").map((cell) => cell.trim())
    );
    setRows(parsedRows);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Data Cleanser</h1>

      <label htmlFor="file-upload" style={{ display: "block", marginBottom: "0.5rem" }}>
        Upload CSV File:
      </label>
      <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />

      {rows.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <thead>
            <tr>
              {rows[0].map((header, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f4f4f4",
                    textAlign: "left",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.slice(1).map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                    title={cell}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
