import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepProduits({ data, setData, onNext, onPrev }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const items = data.produits || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nom || !quantite) return;
    const facteur = facteurs.produit[nom.toLowerCase()] || 0;
    const emission = parseFloat(quantite) * facteur;
    setData({ ...data, produits: [...items, { nom, quantite, emission }] });
    setNom(""); setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items]; updated.splice(i,1);
    setData({ ...data, produits: updated });
  };

  const removeAll = () => {
    if (window.confirm("Supprimer tous les produits/résidus ?")) {
      setData({ ...data, produits: [] });
    }
  };

  return (
    <div className="step-card">
      <h2>Produits / Résidus</h2>

      <form onSubmit={handleAdd}>
        <input placeholder="Nom (ex: produitA, residuA…)" value={nom} onChange={(e)=>setNom(e.target.value)} />
        <input type="number" step="any" placeholder="Quantité" value={quantite} onChange={(e)=>setQuantite(e.target.value)} />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="data-list">
        {items.map((p,i)=>(
          <li key={i} className="row-actions">
            <span>{p.nom} — {p.quantite}</span>
            <span className="muted">{Number(p.emission).toFixed(2)} tCO₂e</span>
            <button className="btn-danger" onClick={()=>removeItem(i)}>Supprimer</button>
          </li>
        ))}
        {items.length===0 && <li className="muted">Aucun élément pour l’instant.</li>}
      </ul>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>
    </div>
  );
}
