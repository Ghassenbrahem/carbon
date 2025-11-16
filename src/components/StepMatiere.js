// src/components/StepMatiere.js
import React, { useState, useEffect } from "react";

export default function StepMatiere({ data, setData, onNext, onPrev }) {
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [facteur, setFacteur] = useState("");

  const matieres = data.matieres || [];

  // ✅ Ta liste officielle avec facteurs
  const listeMatieres = [
    { nom: "Caoutchouc naturel", facteur: 1.38 },
    { nom: "Caoutchouc synthétique", facteur: 2.55 },
    { nom: "Noir carbone", facteur: 2.77 },
    { nom: "Fils métalique", facteur: 2.39 },
    { nom: "Fils d'acier", facteur: 2.39 },
    { nom: "Plastifiant", facteur: 3.71 },
    { nom: "Silice", facteur: 5.00 },
    { nom: "Activant", facteur: 3.68 },
    { nom: "Vulcanissant", facteur: 0.18 },
    { nom: "Liant", facteur: 2.90 },
    { nom: "Antioxydant", facteur: 3.75 }
  ];

  // Quand on choisit une matière dans le select
  const handleSelectMatiere = (value) => {
    setNom(value);
    const selected = listeMatieres.find((m) => m.nom === value);
    if (selected) {
      setFacteur(selected.facteur);
    }
  };

  const ajouterMatiere = () => {
    if (!nom || !quantite || !facteur) return;

    setData((prev) => ({
      ...prev,
      matieres: [
        ...(prev.matieres || []),
        {
          nom,
          quantite: parseFloat(quantite),
          facteur: parseFloat(facteur)
        }
      ]
    }));

    setNom("");
    setQuantite("");
    setFacteur("");
  };

  const supprimerTout = () => {
    setData((prev) => ({
      ...prev,
      matieres: [],
      total_matieres: 0
    }));
  };

  // ✅ Recalcul automatique du total matières et stockage dans data.total_matieres
  useEffect(() => {
    const total = matieres.reduce(
      (sum, m) => sum + m.quantite * m.facteur,
      0
    );

    setData((prev) => ({
      ...prev,
      total_matieres: total
    }));
  }, [matieres, setData]);

  return (
    <div>
      <h2>Matières premières</h2>

      {/* Sélecteur de matière */}
      <select
        value={nom}
        onChange={(e) => handleSelectMatiere(e.target.value)}
      >
        <option value="">Sélectionner une matière</option>
        {listeMatieres.map((m, i) => (
          <option key={i} value={m.nom}>
            {m.nom}
          </option>
        ))}
      </select>

      {/* Quantité */}
      <input
        type="number"
        placeholder="Quantité (Kg)"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
      />

      {/* Facteur auto-rempli mais modifiable */}
      <input
        type="number"
        placeholder="Facteur"
        value={facteur}
        onChange={(e) => setFacteur(e.target.value)}
      />

      <button onClick={ajouterMatiere}>Ajouter</button>

      {/* Tableau des matières */}
      {matieres.length === 0 ? (
        <p>Aucune matière pour l'instant.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>NOM</th>
              <th>QUANTITÉ (KG)</th>
              <th>FACTEUR</th>
              <th>TOTAL (TCO₂E)</th>
            </tr>
          </thead>
          <tbody>
            {matieres.map((m, i) => (
              <tr key={i}>
                <td>{m.nom}</td>
                <td>{m.quantite}</td>
                <td>{m.facteur}</td>
                <td>{(m.quantite * m.facteur).toFixed(2)}</td>
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
