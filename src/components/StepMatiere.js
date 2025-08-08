import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepMatiere({ data, setData, onNext, onPrev }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const items = data.matiere || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nom.trim()) { alert("Nom requis."); return; }
    if (!quantite || Number(quantite) <= 0) { alert("Quantité > 0 requise."); return; }

    const existe = items.some(x => x.nom.toLowerCase() === nom.toLowerCase());
    if (existe) { alert("Cette matière existe déjà."); return; }

    const facteur = facteurs.matiere[nom.toLowerCase()] || 0;
    const emission = Number(quantite) * facteur;

    setData({ ...data, matiere: [...items, { nom, quantite, emission }] });
    setNom(""); setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, matiere: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer toutes les matières ?")) {
      setData({ ...data, matiere: [] });
    }
  };

  const editItem = (i) => {
    const it = items[i];
    setNom(it.nom);
    setQuantite(it.quantite);
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, matiere: updated });
  };

  const total = items.reduce((s,x)=> s + Number(x.emission||0), 0);

  return (
    <div className="step-card">
      <h2>Matières premières</h2>

      <form onSubmit={handleAdd}>
        <input placeholder="Nom (acier, plastique…)" value={nom} onChange={(e)=>setNom(e.target.value)} />
        <input type="number" step="any" placeholder="Quantité" value={quantite} onChange={(e)=>setQuantite(e.target.value)} />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((m,i)=>(
          <li key={i} className="row-actions">
            <span>{m.nom} — {m.quantite}</span>
            <span className="muted">{Number(m.emission).toFixed(2)} tCO₂e</span>
            <div className="row-actions" style={{gap:8}}>
              <button onClick={()=>editItem(i)} className="secondary">Modifier</button>
              <button onClick={()=>removeItem(i)} className="btn-danger">Supprimer</button>
            </div>
          </li>
        ))}
        {items.length===0 && <li className="muted">Aucune matière pour l’instant.</li>}
      </ul>

      <div className="muted" style={{marginTop:8}}>Total étape : {total.toFixed(2)} tCO₂e</div>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>
    </div>
  );
}
