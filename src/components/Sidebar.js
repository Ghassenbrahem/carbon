import React from "react";
import { useTheme } from "../utils/theme";

export default function Sidebar({
  steps,
  currentStep,
  onStepSelect,
  onResetAll,
  totals = {},
  grandTotal
}) {
  const { theme, toggleTheme } = useTheme?.() ?? { theme: "dark", toggleTheme: () => {} };

  return (
    <div className="sidebar">
      {/* En-tête de sidebar : icône thème au CENTRE, plus de texte "Menu" */}
      <div className="sidebar-header center-toggle">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title="Changer le thème"
          aria-label="Changer le thème"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Liste des étapes avec badges de totaux si dispo */}
      <ul>
        {steps.map((s, i) => {
          const hasTotal = typeof totals[s.id] === "number";
          return (
            <li
              key={s.id}
              className={i === currentStep ? "active" : ""}
              onClick={() => onStepSelect(i)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>{s.label}</span>
              {hasTotal && <span className="badge">{totals[s.id].toFixed(2)}</span>}
            </li>
          );
        })}
      </ul>

      <div style={{ padding: "8px 14px" }}>
        <button className="btn-danger" onClick={onResetAll}>Réinitialiser tout</button>
      </div>

      {typeof grandTotal === "number" && (
        <div style={{ padding: "8px 14px", fontSize: "13px", color: "var(--muted)" }}>
          Total général : <strong>{grandTotal.toFixed(2)} tCO₂e</strong>
        </div>
      )}
    </div>
  );
}
