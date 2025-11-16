import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepTransport({ data, setData, onNext, onPrev, grandTotal }) {
  const [quantite, setQuantite] = useState("");
  const items = data.gaz || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite) return;

    const q = parseFloat(quantite);

    // facteur 2447 kgCO2 / Tep
    const facteur = facteurs.gaz.Tep;

    // Convertir en tonnes
    const emission = (q * facteur) ;

    setData({
      ...data,
      gaz: [...items, { nom: "Gaz", quantite: q, emission }]
    });

    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setData({ ...data, gaz: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes de gaz ?")) {
      setData({ ...data, gaz: [] });
    }
  };

  const formatEmission = (v) =>
    v < 0.01 ? v.toFixed(6) : v.toFixed(3);

  return (
    <div className="step-card">
      <h2>Gaz</h2>

      <form onSubmit={handleAdd}>
        <input
          type="number"
          step="any"
          placeholder="Quantité (Tep)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((g, i) => (
          <li key={i} className="row-actions">
            <span>{g.nom} — {g.quantite} Tep</span>
            <span className="muted">{formatEmission(g.emission)} KgCO₂e</span>
            <button className="btn-danger" onClick={() => removeItem(i)}>
              Supprimer
            </button>
          </li>
        ))}

        {items.length === 0 && (
          <li className="muted">Aucune ligne pour l’instant.</li>
        )}
      </ul>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>

      <TotalBar total={grandTotal} max={200} />
    </div>
  );
}
