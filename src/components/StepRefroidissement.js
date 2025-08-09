import React, { useState, useEffect } from "react";
import facteurs from "../data/facteurs.json";

/**
 * Émissions (tCO₂e) = Quantité (kg) × GWP × (Taux annuel / 100) / 1000
 * -> division par 1000 pour passer kgCO₂e -> tCO₂e si tu préfères rester en t
 * Si tu veux rester en kgCO₂e, retire simplement le "/ 1000".
 */
export default function StepRefroidissement({ data, setData, onNext, onPrev }) {
  const items = data.refroidissement || [];

  // Liste de GWP par défaut (fallback si absents dans facteurs.json)
  const gwpMap = {
    R134a: 1430,
    R410A: 2088,
    R32: 675,
    R744_CO2: 1,
    R1234yf: 4,
    ...(facteurs.gwp || {})
  };

  const [row, setRow] = useState({
    type: "R410A",
    quantite: "",
    gwp: gwpMap["R410A"] || 2088,
    taux: "" // %/an
  });

  // Auto-préremplir le GWP quand on change de type, si connu
  useEffect(() => {
    const f = gwpMap[row.type];
    if (typeof f === "number") {
      setRow(r => ({ ...r, gwp: f }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.type]);

  const verify = () => {
    const q = Number(row.quantite);
    const g = Number(row.gwp);
    const t = Number(row.taux);
    if (!row.type) return alert("Type requis.");
    if (!q || q <= 0) return alert("Quantité (kg) > 0 requise.");
    if (!g || g <= 0) return alert("GWP > 0 requis.");
    if (!t || t <= 0) return alert("Taux annuel (%) > 0 requis.");
    return true;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!verify()) return;

    const q = Number(row.quantite);
    const g = Number(row.gwp);
    const t = Number(row.taux);

    // en tCO2e : kg * gwp * (t/100) / 1000
    const emission = (q * g * (t / 100)) / 1000;

    setData(prev => ({
      ...prev,
      refroidissement: [
        ...(prev.refroidissement || []),
        { type: row.type, quantite: q, gwp: g, taux: t, emission }
      ]
    }));

    setRow(r => ({ ...r, quantite: "", taux: "" }));
  };

  const removeItem = (i) => {
    setData(prev => {
      const updated = [...(prev.refroidissement || [])];
      updated.splice(i, 1);
      return { ...prev, refroidissement: updated };
    });
  };

  const removeAll = () => {
    if (!window.confirm("Supprimer toutes les lignes de refroidissement ?")) return;
    setData(prev => ({ ...prev, refroidissement: [] }));
  };

  const totalSection = items.reduce((s, x) => s + Number(x.emission || 0), 0);

  return (
    <div className="step-card">
      <h2>Émissions – Systèmes de refroidissement</h2>

      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>
        <select
          value={row.type}
          onChange={(e) => setRow({ ...row, type: e.target.value })}
          title="Type de fluide frigorigène"
        >
          {Object.keys(gwpMap).map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        <input
          type="number"
          step="any"
          placeholder="Quantité (kg)"
          value={row.quantite}
          onChange={(e) => setRow({ ...row, quantite: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="GWP"
          value={row.gwp}
          onChange={(e) => setRow({ ...row, gwp: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="Taux annuel (%)"
          value={row.taux}
          onChange={(e) => setRow({ ...row, taux: e.target.value })}
        />

        <button type="submit">Ajouter</button>
      </form>

      <table className="table-pro" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantité (kg)</th>
            <th>GWP</th>
            <th>Taux annuel (%)</th>
            <th>Émissions (tCO₂e)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6} className="muted">Aucune ligne pour l’instant.</td></tr>
          ) : items.map((it, i) => (
            <tr key={i}>
              <td>{it.type}</td>
              <td>{it.quantite}</td>
              <td>{it.gwp}</td>
              <td>{it.taux}</td>
              <td>{Number(it.emission).toFixed(4)}</td>
              <td style={{ textAlign: "right" }}>
                <button className="btn-danger" onClick={() => removeItem(i)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
        {items.length > 0 && (
          <tfoot>
            <tr className="total-row">
              <td colSpan={4}><strong>Total étape</strong></td>
              <td><strong>{totalSection.toFixed(4)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="actions" style={{ marginTop: 10 }}>
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        {items.length > 0 && (
          <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
        )}
      </div>
    </div>
  );
}
