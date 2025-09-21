import React, { useState } from "react";
import facteurs from "../data/facteurs.json";

export default function StepTransportMatiere({ data, setData, onNext, onPrev }) {
  const [row, setRow] = useState({
    nom: "",
    quantite: "",
    pays: "",
    km: "",
    mode: "route"
  });

  const items = data.transportMatiere || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!row.nom || !row.quantite || !row.km) return;

    const q = parseFloat(row.quantite);
    const km = parseFloat(row.km);
    const facteur = facteurs.transportMatiere[row.mode] || 0;

    // Émissions en kgCO₂e
    const emission = q * km * facteur;

    setData(prev => ({
      ...prev,
      transportMatiere: [
        ...(prev.transportMatiere || []),
        { ...row, facteur, emission }
      ]
    }));

    setRow({ nom: "", quantite: "", pays: "", km: "", mode: "route" });
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

      {/* Formulaire */}
      <form onSubmit={handleAdd} className="grid-form" style={{ gap: 8 }}>
        <input
          type="text"
          placeholder="Nom de l’article"
          value={row.nom}
          onChange={(e) => setRow({ ...row, nom: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="Quantité (t)"
          value={row.quantite}
          onChange={(e) => setRow({ ...row, quantite: e.target.value })}
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
          value={row.km}
          onChange={(e) => setRow({ ...row, km: e.target.value })}
        />
        <select
          value={row.mode}
          onChange={(e) => setRow({ ...row, mode: e.target.value })}
        >
          {Object.keys(facteurs.transportMatiere).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {/* Tableau */}
      <table className="data-table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité (t)</th>
            <th>Pays</th>
            <th>Km</th>
            <th>Mode</th>
            <th>Facteur</th>
            <th>Émissions (kgCO₂e)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => (
              <tr key={i}>
                <td>{item.nom}</td>
                <td>{item.quantite}</td>
                <td>{item.pays}</td>
                <td>{item.km}</td>
                <td>{item.mode}</td>
                <td>{item.facteur}</td>
                <td>{item.emission.toFixed(2)}</td>
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
                Aucun transport enregistré.
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

