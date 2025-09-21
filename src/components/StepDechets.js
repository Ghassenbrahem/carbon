import React, { useState } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepDechets({ data, setData, onNext, onPrev, grandTotal }) {
  const [nom, setNom] = useState("");          // type de déchet choisi
  const [quantite, setQuantite] = useState(""); 
  const items = data.dechets || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nom || !quantite) return;

    const facteur = facteurs.dechets[nom] || 0;  // récupère le facteur du JSON
    const emission = parseFloat(quantite) * facteur;

    setData({
      ...data,
      dechets: [...items, { nom, quantite, facteur, emission }]
    });

    setNom("");
    setQuantite("");
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
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

      {/* Formulaire */}
      <form onSubmit={handleAdd}>
        <select value={nom} onChange={(e) => setNom(e.target.value)}>
          <option value="">-- Choisir un type --</option>
          {Object.keys(facteurs.dechets).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <input
          type="number"
          step="any"
          placeholder="Quantité (kg)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Tableau style Excel */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité (kg)</th>
            <th>Facteur (kgCO₂e/kg)</th>
            <th>Émissions (kgCO₂e)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="5" className="muted">Aucune ligne pour l’instant.</td>
            </tr>
          ) : (
            items.map((d, i) => (
              <tr key={i}>
                <td>{d.nom}</td>
                <td>{d.quantite}</td>
                <td>{d.facteur}</td>
                <td>{d.emission.toFixed(2)}</td>
                <td>
                  <button className="btn-danger" onClick={() => removeItem(i)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Boutons navigation + barre totale */}
      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button className="btn-danger" onClick={removeAll}>Supprimer tout</button>
      </div>

      <TotalBar
        total={grandTotal}   // total général
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

