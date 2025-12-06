import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepTransportMatiere({ data, setData, onNext, onPrev }) {
  const [row, setRow] = useState({
    nom: "",
    masse: "",
    pays: "",
    type: "routier",       // 🔥 CORRECTION : computeTotals lit "type"
    distance: ""
  });

  const items = data.transportMatiere || [];

  const handleAdd = (e) => {
    e.preventDefault();

    if (!row.nom || !row.masse || !row.distance) return;

    const masseKg = parseFloat(row.masse);
    const masseT = masseKg / 1000;   // 🔥 conversion kg → tonnes

    const distance = parseFloat(row.distance);
    const facteur = facteurs.transportMatiere[row.type] || 0;

    const emission = masseT * distance * facteur;  // 🔥 bonne formule

    setData(prev => ({
      ...prev,
      transportMatiere: [
        ...(prev.transportMatiere || []),
        {
          nom: row.nom,
          pays: row.pays,
          masse: masseKg,     // on stocke en kg pour l’affichage
          masseT,             // utilisé pour les calculs
          type: row.type,     // 🔥 computeTotals lit "type"
          distance,
          facteur,
          emission
        }
      ]
    }));

    // reset
    setRow({
      nom: "",
      masse: "",
      pays: "",
      type: "routier",
      distance: ""
    });
  };

  const removeItem = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setData({ ...data, transportMatiere: updated });
  };

  return (
    <div className="step-card">
      <h2>Transport Matières Premières</h2>

      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>
        
        <input
          type="text"
          placeholder="Matière"
          value={row.nom}
          onChange={(e) => setRow({ ...row, nom: e.target.value })}
        />

        <input
          type="number"
          step="any"
          placeholder="Masse (kg)"
          value={row.masse}
          onChange={(e) => setRow({ ...row, masse: e.target.value })}
        />

        <input
          type="text"
          placeholder="Pays"
          value={row.pays}
          onChange={(e) => setRow({ ...row, pays: e.target.value })}
        />

        <input
          type="number"
          step="any"
          placeholder="Distance (km)"
          value={row.distance}
          onChange={(e) => setRow({ ...row, distance: e.target.value })}
        />

        <select
          value={row.type}
          onChange={(e) => setRow({ ...row, type: e.target.value })}
        >
          <option value="routier">Routier</option>
          <option value="maritime">Maritime</option>
          <option value="ferroviaire">Ferroviaire</option>
          <option value="aerien">Aérien</option>
        </select>

        <button type="submit">Ajouter</button>
      </form>

      <table className="data-table" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th>Matière première</th>
            <th>Masse (kg)</th>
            <th>Mode</th>
            <th>Distance (km)</th>
            <th>Facteur (kgCO₂e/t.km)</th>
            <th>Émissions (kgCO₂e)</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
                <td>{item.nom}</td>
                <td>{item.masse}</td>
                <td>{item.type}</td>
                <td>{item.distance}</td>
                <td>{item.facteur}</td>
                <td>{item.emission.toFixed(3)}</td>
                <td>
                  <button className="btn-danger" onClick={() => removeItem(i)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="muted">Aucun transport enregistré</td>
            </tr>
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
