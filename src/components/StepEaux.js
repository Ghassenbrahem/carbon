// src/components/StepEaux.js
import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepEaux({ data, setData, onNext, onPrev, grandTotal }) {
  const [quantite, setQuantite] = useState("");
  const items = data.eaux || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite || Number(quantite) <= 0) { alert("Quantité (m³) > 0 requise."); return; }
    const f = (facteurs.eaux && facteurs.eaux["m3"]) || 0;
    const emission = Number(quantite) * f;
    setData({ ...data, eaux: [...items, { nom: "Eaux usées", quantite, emission }] });
    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i, 1);
    setData({ ...data, eaux: updated });
  };

  const editItem = (i) => {
    const it = items[i];
    setQuantite(it.quantite);
    const updated = [...items]; updated.splice(i, 1);
    setData({ ...data, eaux: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes d’eau de décharge ?")) {
      setData({ ...data, eaux: [] });
    }
  };

  const totalSection = items.reduce((s, x) => s + Number(x.emission || 0), 0);

  return (
    <div className="step-card">
      <h2>Eau de décharge</h2>

      <form onSubmit={handleAdd}>
        <input
          type="number"
          step="any"
          placeholder="Quantité (m³)"
          value={quantite}
          onChange={(e)=>setQuantite(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((e, i) => (
          <li key={i} className="row-actions">
            <span>{e.nom} — {e.quantite} m³</span>
            <span className="muted">{Number(e.emission).toFixed(2)} tCO₂e</span>
            <div className="row-actions" style={{ gap: 8 }}>
              <button onClick={() => editItem(i)} className="secondary">Modifier</button>
              <button onClick={() => removeItem(i)} className="btn-danger">Supprimer</button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="muted">Aucune ligne pour l’instant.</li>}
      </ul>

      <div className="muted" style={{ marginTop: 8 }}>
        Total étape : <strong>{totalSection.toFixed(2)} tCO₂e</strong>
      </div>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>

      {/* Barre totale sous les boutons */}
      <TotalBar
        total={grandTotal}             // total général
        max={200}                      // ajuste l’échelle/objectif si besoin
        year={data?.general?.annee}
        onDetails={() => {
          const el = document.getElementById("rapport-detaille");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
