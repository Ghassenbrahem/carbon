// src/components/StepDistribution.js
import React, { useState, useEffect } from "react";
import facteurs from "../data/facteurs.json";

export default function StepDistribution({ data, setData, onNext, onPrev }) {
  const [type, setType] = useState("route"); // channel / type
  const [quantite, setQuantite] = useState(""); // q-distru
  const [km, setKm] = useState("");
  const [facteur, setFacteur] = useState(facteurs.distribution?.route || 0);

  const items = data.distribution || [];

  // si l’utilisateur change le type, on pré-remplit le facteur si connu
  useEffect(() => {
    const f = facteurs.distribution?.[type];
    if (typeof f === "number") setFacteur(f);
  }, [type]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!type || !quantite || !km || facteur === "" || isNaN(facteur)) return;

    const qNum = parseFloat(quantite);
    const kmNum = parseFloat(km);
    const fNum = parseFloat(facteur);

    const emission = fNum * kmNum * qNum;

    setData(prev => ({
      ...prev,
      distribution: [
        ...(prev.distribution || []),
        { type, quantite: qNum, km: kmNum, facteur: fNum, emission }
      ]
    }));

    // reset inputs (on garde le type)
    setQuantite("");
    setKm("");
  };

  const removeItem = (i) => {
    setData(prev => {
      const updated = [...(prev.distribution || [])];
      updated.splice(i, 1);
      return { ...prev, distribution: updated };
    });
  };


  return (
    <div className="step-card">
      <h2>Distribution</h2>

      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="route">Route</option>
          <option value="rail">Rail</option>
          <option value="maritime">Maritime</option>
          <option value="aerien">Aérien</option>
          {/* ajoute ici d'autres "channels" si besoin */}
        </select>

        <input
          type="number"
          step="any"
          placeholder="Quantité distribuée (t)"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Kilométrage (km)"
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Facteur (tCO₂e / t·km)"
          value={facteur}
          onChange={(e) => setFacteur(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      <table className="data-table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantité (t)</th>
            <th>Km</th>
            <th>Facteur</th>
            <th>Émissions (kgCO₂e)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
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
            <tr>
              <td colSpan="6" className="muted">Aucune distribution enregistrée.</td>
            </tr>
          )}
        </tbody>
        {items.length > 0 && (
          <tfoot>
            <tr className="total-row">
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
      </div>
    </div>
  );
}
