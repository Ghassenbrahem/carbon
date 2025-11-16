import React, { useState, useEffect } from "react";
import facteurs from "../data/facteurs.json";

export default function StepDistribution({ data, setData, onNext, onPrev }) {

  const [canal, setCanal] = useState("");
  const [type, setType] = useState("routier");  // valeur par défaut corrigée
  const [quantite, setQuantite] = useState("");
  const [km, setKm] = useState("");

  // FACTEUR AUTO
  const [facteur, setFacteur] = useState(facteurs.distribution.routier);

  const items = data.distribution || [];

  // 🔥 mise à jour auto du facteur quand le type change
  useEffect(() => {
    const f = facteurs.distribution[type];
    if (typeof f === "number") setFacteur(f);
  }, [type]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!canal || !type || !quantite || !km) return;

    const q = parseFloat(quantite);
    const k = parseFloat(km);
    const f = parseFloat(facteur);

    const emission = q * k * f;

    setData(prev => ({
      ...prev,
      distribution: [
        ...(prev.distribution || []),
        { canal, type, quantite: q, km: k, facteur: f, emission }
      ]
    }));

    setCanal("");
    setQuantite("");
    setKm("");
  };

  const removeItem = (i) => {
    setData(prev => {
      const copy = [...prev.distribution];
      copy.splice(i, 1);
      return { ...prev, distribution: copy };
    });
  };

  return (
    <div className="step-card">
      <h2>Distribution</h2>

      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>

        {/* CANAL */}
        <input
          type="text"
          placeholder="Canal (ex : Export, Local...)"
          value={canal}
          onChange={(e) => setCanal(e.target.value)}
        />

        {/* TYPE */}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="routier">Routier</option>
          <option value="maritime">Maritime</option>
          <option value="aerien">Aérien</option>
        </select>

        {/* QUANTITÉ */}
        <input
          type="number"
          step="any"
          placeholder="Quantité (t)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />

        {/* KM */}
        <input
          type="number"
          step="any"
          placeholder="Distance (km)"
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />

        {/* FACTEUR auto-rempli */}
        <input
          type="number"
          step="any"
          placeholder="Facteur (tCO₂e/t·km)"
          value={facteur}
          onChange={(e) => setFacteur(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      <table className="data-table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Canal</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Km</th>
            <th>Facteur</th>
            <th>Émissions</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
                <td>{item.canal}</td>
                <td>{item.type}</td>
                <td>{item.quantite}</td>
                <td>{item.km}</td>
                <td>{item.facteur}</td>
                <td>{item.emission.toFixed(4)}</td>
                <td>
                  <button className="btn-danger" onClick={() => removeItem(i)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="muted">Aucune distribution enregistrée.</td></tr>
          )}
        </tbody>
      </table>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
      </div>
    </div>
  );
}
