import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepEauDouce({ data, setData, onNext, onPrev, grandTotal }) {
  const [quantite, setQuantite] = useState("");
  const [type, setType] = useState("Osmose inverse");  // valeur par défaut
  const items = data.eaudouce || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite) return;

    const facteur = facteurs.eaudouce[type] || 0;
    const emission = parseFloat(quantite) * facteur;

    setData({
      ...data,
      eaudouce: [...items, { nom: type, quantite, facteur, emission }]
    });

    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setData({ ...data, eaudouce: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes d’eau ?")) {
      setData({ ...data, eaudouce: [] });
    }
  };

  return (
    <div className="step-card">
      <h2>Eau douce</h2>

      <form onSubmit={handleAdd}>
        {/* Choix du type */}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {Object.keys(facteurs.eaudouce).map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>

        {/* Quantité */}
        <input
          type="number"
          step="any"
          placeholder="Quantité (m³)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des entrées */}
      <ul className="data-list">
        {items.map((e, i) => (
          <li key={i} className="row-actions">
            <span>{e.nom} — {e.quantite} m³ × {e.facteur} = {Number(e.emission).toFixed(2)} kgCO₂e</span>
            <button className="btn-danger" onClick={() => removeItem(i)}>Supprimer</button>
          </li>
        ))}
        {items.length === 0 && <li className="muted">Aucune ligne pour l’instant.</li>}
      </ul>

      {/* Actions */}
      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>

      {/* Barre totale */}
      <TotalBar
        total={grandTotal}
        max={200}
        year={data?.general?.annee}
        onDetails={() => {
          const el = document.getElementById("rapport-detaille");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

