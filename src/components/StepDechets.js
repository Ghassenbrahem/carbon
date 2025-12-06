import React, { useState, useEffect } from "react";
import facteurs from "../data/facteurs.json";
import TotalBar from "./TotalBar";

export default function StepDechets({ data, setData, onNext, onPrev, grandTotal }) {
  const [nom, setNom] = useState("");           
  const [quantite, setQuantite] = useState(""); 
  const [facteur, setFacteur] = useState("");   

  const items = data.dechets || [];

  // 🔥 Auto-remplissage du facteur
  useEffect(() => {
    if (facteurs?.dechets?.[nom]) {
      setFacteur(facteurs.dechets[nom]); // valeur auto
    }
  }, [nom]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nom || !quantite || !facteur) return;

    const q = parseFloat(quantite);
    const f = parseFloat(facteur);
    const emission = q * f;

    const newItem = {
      nom,
      quantite: q,
      facteur: f,
      emission
    };

    setData({
      ...data,
      dechets: [...items, newItem]
    });

    setNom("");
    setQuantite("");
    setFacteur("");
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
      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>

        {/* Type de déchet */}
        <input
          type="text"
          placeholder="Type de déchet (Plastique, Métal...)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        {/* Quantité */}
        <input
          type="number"
          step="any"
          placeholder="Quantité (kg)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />

        {/* Facteur */}
        <input
          type="number"
          step="any"
          placeholder="Facteur KgCO₂e/kg"
          value={facteur}
          onChange={(e) => setFacteur(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      {/* Tableau */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantité (kg)</th>
            <th>Facteur</th>
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
                <td>{d.emission.toFixed(3)}</td>
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

      {/* Navigation */}
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
