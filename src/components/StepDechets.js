import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepDechets({ data, setData, onNext, onPrev }) {
  const [quantite, setQuantite] = useState("");
  const items = data.dechets || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite) return;
    const emission = parseFloat(quantite) * (facteurs.dechets["kg"] || 0);
    setData({ ...data, dechets: [...items, { nom: "Déchets", quantite, emission }] });
    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, dechets: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes de déchets ?")) {
      setData({ ...data, dechets: [] });
    }
  };

  return (
    <div className="step-card">
      <h2>Déchets</h2>

      <form onSubmit={handleAdd}>
        <input type="number" step="any" placeholder="Quantité (kg)" value={quantite} onChange={(e)=>setQuantite(e.target.value)} />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((d,i)=>(
          <li key={i} className="row-actions">
            <span>{d.nom} — {d.quantite} kg</span>
            <span className="muted">{Number(d.emission).toFixed(2)} tCO₂e</span>
            <button className="btn-danger" onClick={()=>removeItem(i)}>Supprimer</button>
          </li>
        ))}
        {items.length===0 && <li className="muted">Aucune ligne pour l’instant.</li>}
      </ul>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>
    </div>
  );
}
