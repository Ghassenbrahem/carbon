import React from "react";
import { useTheme } from "../utils/theme"; // si tu as le switch thème

export default function Sidebar({ steps, currentStep, onStepSelect, onResetAll }) {
  const { theme, toggleTheme } = useTheme?.() ?? { theme: "dark", toggleTheme: ()=>{} };

  return (
    <div className="sidebar">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 14px" }}>
        <span style={{ fontWeight:"bold" }}>Menu</span>
        <button onClick={toggleTheme} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:"18px", color:"var(--text)" }} title="Changer le thème">
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>

      <ul>
        {steps.map((s, i) => (
          <li key={s.id} className={i === currentStep ? "active" : ""} onClick={() => onStepSelect(i)}>
            {s.label}
          </li>
        ))}
      </ul>

      <div style={{ padding:"8px 14px" }}>
        <button className="btn-danger" onClick={onResetAll}>Réinitialiser tout</button>
      </div>
    </div>
  );
}
