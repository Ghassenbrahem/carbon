import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepTransportMatiere({ data, setData, onNext, onPrev }) {
  const [row, setRow] = useState({
    nom: "",
    masse: "",
    pays: "",
    mode: "routier",
    distance: "",
    facteur: "",
  });

  // Liste existante
  const items = data.transportMatiere || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!row.nom || !row.masse || !row.distance || !row.mode) return;

    const masse = parseFloat(row.masse);
    const distance = parseFloat(row.distance);
    const facteur = facteurs.transportMatiere[row.mode] || 0;

    const emission = masse * distance * facteur;

    setData((prev) => ({
      ...prev,
      transportMatiere: [
        ...(prev.transportMatiere || []),
        {
          ...row,
          masse,
          distance,
          facteur,
          emission,
        },
      ],
    }));

    setRow({
      nom: "",
      masse: "",
      pays: "",
      mode: "routier",
      distance: "",
      facteur: "",
    });
  };

  const removeItem = (i) => {
    setData((prev) => {
      const updated = [...(prev.transportMatiere || [])];
      updated.splice(i, 1);
      return { ...prev, transportMatiere: updated };
    });
  };

  return (
    <div className="step-card">
      <h2>Transport Matières Premières</h2>

      {/* Formulaire */}
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
          placeholder="Masse transportée (T)"
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
          value={row.mode}
          onChange={(e) => setRow({ ...row, mode: e.target.value })}
        >
          <option value="routier">Routier</option>
          <option value="maritime">Maritime</option>
          <option value="ferroviaire">Ferroviaire</option>
          <option value="aerien">Aérien</option>
        </select>

        <button type="submit">Ajouter</button>
      </form>

      {/* Tableau */}
      <table className="data-table" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th>Matière première</th>
            <th>Masse (kg)</th>
            <th>Pays</th>
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
                <td>{item.pays}</td>
                <td>{item.mode}</td>
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
              <td colSpan="8" className="muted">
                Aucun transport enregistré
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Navigation */}
      <div className="actions">
        <button className="secondary" onClick={onPrev}>
          Précédent
        </button>
        <button onClick={onNext}>Suivant</button>
      </div>
    </div>
  );
}
