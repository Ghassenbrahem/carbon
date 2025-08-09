import React from "react";

export default function TotalBar({ total, max = 100, year, onDetails }) {
  const pct = Math.min(100, Math.max(0, (total / max) * 100 || 0));

  return (
    <div className="totalbar">
      <div className="track">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="summary-card">
        <div className="card-title">Total CO₂ eq {year ? `(${year})` : ""}</div>
        <div className="card-value">{Number(total || 0).toFixed(2)} tCO₂e</div>
      </div>

      <div className="pct-label">{pct.toFixed(1)}%</div>
    </div>
  );
}
