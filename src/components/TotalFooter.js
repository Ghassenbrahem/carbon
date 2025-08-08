import React from "react";

export default function TotalFooter({ total }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "20px",
      gap: "10px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        padding: "10px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--panel-2)",
        fontSize: "14px"
      }}>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>Total CO₂ eq</span>
        <strong>{total.toFixed(2)} tCO₂e</strong>
        <a href="#rapport-detail" style={{ fontSize: "12px", color: "blue" }}>Rapport détaillé</a>
      </div>
    </div>
  );
}
