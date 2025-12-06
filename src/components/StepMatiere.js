// src/components/StepMatiere.js
import React, { useState, useEffect } from "react";

export default function StepMatiere({ data, setData, onNext, onPrev }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [facteur, setFacteur] = useState("");

  // ⚠️ Correction principale : utiliser data.matiere (sans S)
  const matieres = data.matiere || [];

  // Liste avec facteurs
  const listeMatieres = [
    { nom: "Caoutchouc naturel", facteur: 1.38 },
    { nom: "Caoutchouc synthétique", facteur: 2.55 },
    { nom: "Noir carbone", facteur: 2.77 },
    { nom: "Fils métalique", facteur: 2.39 },
    { nom: "Fils d'acier", facteur: 2.39 },
    { nom: "Plastifiant", facteur: 3.71 },
    { nom: "Silice", facteur: 5.0 },
    { nom: "Activant", facteur: 3.68 },
    { nom: "Vulcanissant", facteur: 0.18 },
    { nom: "Liant", facteur: 2.9 },
    { nom: "Antioxydant", facteur: 3.75 }
  ];

  const handleSelectMatiere = (value) => {
    setNom(value);
    const selected = listeMatieres.find((m) => m.nom === value);
    setFacteur(selected ? selected.facteur : "");
  };

  const ajouterMatiere = () => {
    if (!nom || !quantite || !facteur) return;

    const q = parseFloat(quantite);
    const f = parseFloat(facteur);
    const emission = q * f;

    setData((prev) => ({
      ...prev,
      // ⚠️ Correction : enregistrement dans "matiere"
      matiere: [
        ...(prev.matiere || []),
        { nom, quantite: q, facteur: f, emission }
      ]
    }));

    setNom("");
    setQuantite("");
    setFacteur("");
  };

  const supprimerTout = () => {
    setData((prev) => ({
      ...prev,
      matiere: [],
      total_matieres: 0
    }));
  };

  // Recalcul total
  useEffect(() => {
    const total = (matieres || [])
      .reduce((sum, m) => sum + Number(m.emission || 0), 0);

    setData((prev) => ({
      ...prev,
      total_matieres: total
    }));
  }, [matieres, setData]);

  return (
    <div>
      <h2>Matières premières</h2>

      <select value={nom} onChange={(e) => handleSelectMatiere(e.target.value)}>
        <option value="">Sélectionner une matière</option>
        {listeMatieres.map((m, i) => (
          <option key={i} value={m.nom}>{m.nom}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantité (Kg)"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
      />

      <input
        type="number"
        placeholder="Facteur"
        value={facteur}
        onChange={(e) => setFacteur(e.target.value)}
      />

      <button onClick={ajouterMatiere}>Ajouter</button>

      {matieres.length === 0 ? (
        <p>Aucune matière pour l'instant.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>NOM</th>
              <th>QUANTITÉ (KG)</th>
              <th>FACTEUR</th>
              <th>TOTAL (KgCO₂E)</th>
            </tr>
          </thead>
          <tbody>
            {matieres.map((m, i) => (
              <tr key={i}>
                <td>{m.nom}</td>
                <td>{m.quantite}</td>
                <td>{m.facteur}</td>
                <td>{m.emission.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <button onClick={onPrev}>Précédent</button>
        <button onClick={onNext}>Suivant</button>
        <button onClick={supprimerTout}>Supprimer tout</button>
      </div>
    </div>
  );
}
