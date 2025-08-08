import React from "react";

export default function TotalCard({ total = 0, title = "TOTAL DES ÉMISSIONS" }) {
  const value = Number(total || 0).toFixed(2);
  return (
    <div className="total-card">
      <div className="total-card__header">
        <span className="dot" />
        <span className="title">{title}</span>
      </div>

      <div className="total-card__content">
        <div className="co2-icon">
          <span className="co2">CO₂</span>
        </div>
        <div className="value">{value}</div>
        <div className="subtitle">Tonnes en équivalent CO2</div>
      </div>
    </div>
  );
}
