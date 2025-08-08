// src/components/StepProduits.js
import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepProduits({ data, setData, onNext, onPrev, grandTotal }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const items = data.produits || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nom.trim()) { alert("Nom requis."); return; }
    if (!quantite || Number(quantite) <= 0) { alert("Quantité > 0 requise."); return; }

    // facteur d’émission depuis facteurs.json (optionnel si non trouvé -> 0)
    const f = (facteurs.produits && facteurs.produits[nom.toLowerCase()]) || 0;
    const emission = Number(quantite) * f;

    setData({ ...data, produits: [...items, { nom, quantite, emission }] });
    setNom(""); setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i, 1);
    setData({ ...data, produits: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer tous les produits / résidus ?")) {
      setData({ ...data, produits: [] });
    }
  };

  const editItem = (i) => {
    const it = items[i];
    setNom(it.nom);
    setQuantite(it.quantite);
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, produits: updated });
  };

  const totalSection = items.reduce((s, x) => s + Number(x.emission || 0), 0);

  return (
    <div className="step-card">
      <h2>Produits / Résidus</h2>

      <form onSubmit={handleAdd}>
        <input
          placeholder="Nom (produit ou résidu)"
          value={nom}
          onChange={(e)=>setNom(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Quantité"
          value={quantite}
          onChange={(e)=>setQuantite(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((p, i) => (
          <li key={i} className="row-actions">
            <span>{p.nom} — {p.quantite}</span>
            <span className="muted">{Number(p.emission).toFixed(2)} tCO₂e</span>
            <div className="row-actions" style={{gap:8}}>
              <button onClick={()=>editItem(i)} className="secondary">Modifier</button>
              <button onClick={()=>removeItem(i)} className="btn-danger">Supprimer</button>
            </div>
          </li>
        ))}
        {items.length===0 && <li className="muted">Aucun élément pour l’instant.</li>}
      </ul>

      <div className="muted" style={{marginTop:8}}>
        Total étape : <strong>{totalSection.toFixed(2)} tCO₂e</strong>
      </div>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>

      {/* Barre totale sous les boutons */}
      <TotalBar
        total={grandTotal}              // total général
        max={200}                       // ajuste l’échelle/objectif
        year={data?.general?.annee}
        onDetails={()=>{
          const el = document.getElementById("rapport-detaille");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
