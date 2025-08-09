import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";


export default function StepTransport({ data, setData, onNext, onPrev, grandTotal }) {
  const [quantite, setQuantite] = useState("");
  const items = data.eaudouce || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite) return;
    const emission = parseFloat(quantite) * (facteurs.eaudouce["m3"] || 0);
    setData({ ...data, eaudouce: [...items, { nom: "Eau ", quantite, emission }] });
    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, eaudouce: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les lignes d’eau  ?")) {
      setData({ ...data, eaudouce: [] });
    }
  };

  return (
    <div className="step-card">
      <h2>Eau douce</h2>

      <form onSubmit={handleAdd}>
        <input type="number" step="any" placeholder="Quantité (m³)" value={quantite} onChange={(e)=>setQuantite(e.target.value)} />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((e,i)=>(
          <li key={i} className="row-actions">
            <span>{e.nom} — {e.quantite} m³</span>
            <span className="muted">{Number(e.emission).toFixed(2)} tCO₂e</span>
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
