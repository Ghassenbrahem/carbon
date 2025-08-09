import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepTransportMatiere({ data, setData, onNext, onPrev }) {
  const [quantite, setQuantite] = useState("");
  const [km, setKm] = useState("");
  const [mode, setMode] = useState("route");

  // On lit depuis formData global
  const items = data.transportMatiere || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!quantite || !km) return;

    const facteur = facteurs.transportMatiere[mode] || 0;
    const emission = parseFloat(quantite) * parseFloat(km) * facteur;

    // On met à jour le formData global
    setData(prev => ({
      ...prev,
      transportMatiere: [
        ...(prev.transportMatiere || []),
        { quantite, km, mode, facteur, emission }
      ]
    }));

    setQuantite("");
    setKm("");
    setMode("route");
  };

  const removeItem = (i) => {
    setData(prev => {
      const updated = [...(prev.transportMatiere || [])];
      updated.splice(i, 1);
      return { ...prev, transportMatiere: updated };
    });
  };

  return (
    <div className="step-card">
      <h2>Transport Matières Premières</h2>
      <form onSubmit={handleAdd} className="grid-form">
        <input
          type="number"
          step="any"
          placeholder="Quantité transportée (t)"
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
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="route">Route</option>
          <option value="rail">Rail</option>
          <option value="maritime">Maritime</option>
          <option value="aerien">Aérien</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Quantité (t)</th>
            <th>Km</th>
            <th>Mode</th>
            <th>Facteur</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
                <td>{item.quantite}</td>
                <td>{item.km}</td>
                <td>{item.mode}</td>
                <td>{item.facteur}</td>
                <td>
                  <button className="btn-danger" onClick={() => removeItem(i)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="muted">
                Aucun transport enregistré.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="actions">
        <button className="secondary" onClick={onPrev}>
          Précédent
        </button>
        <button onClick={onNext}>Suivant</button>
      </div>
    </div>
  );
}
