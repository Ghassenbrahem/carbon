// src/App.js
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StepGeneral from "./components/StepGeneral";
import StepMatiere from "./components/StepMatiere";
import StepProduits from "./components/StepProduits";
import StepEaux from "./components/StepEaux";
import StepElectricite from "./components/StepElectricite";
import StepEauDouce from "./components/StepEauDouce";
import StepGaz from "./components/StepGaz";
import StepDechets from "./components/StepDechets";
import StepTransport from "./components/StepTransport";
import Summary from "./components/Summary";
import { saveData, loadData } from "./utils/storage";

const steps = [
  { id: "general", label: "Informations générales", component: StepGeneral },
  { id: "matiere", label: "Matières premières", component: StepMatiere },
  { id: "produits", label: "Produits / Résidus", component: StepProduits },
  { id: "eaux", label: "Eau de décharge", component: StepEaux },
  { id: "electricite", label: "Électricité", component: StepElectricite },
  { id: "eaudouce", label: "Eau douce", component: StepEauDouce },
  { id: "gaz", label: "Gaz", component: StepGaz },
  { id: "dechets", label: "Déchets", component: StepDechets },
  { id: "transport", label: "Transport", component: StepTransport },
  { id: "summary", label: "Synthèse", component: Summary }
];

const LAST_INDEX = steps.length - 1;

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => loadData() || {});

  useEffect(() => {
    saveData(formData);
  }, [formData]);

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(i, LAST_INDEX));
    setCurrentStep(clamped);
  };

  const onNext = () => setCurrentStep((i) => Math.min(i + 1, LAST_INDEX));
  const onPrev = () => setCurrentStep((i) => Math.max(i - 1, 0));

  const resetAll = () => {
    if (window.confirm("Tout réinitialiser ?")) {
      setFormData({});
      localStorage.removeItem("carboneForm");
      setCurrentStep(0);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="app">
      <Sidebar
        steps={steps}
        currentStep={currentStep}
        onStepSelect={goTo}
        onResetAll={resetAll} // ← bouton “Réinitialiser tout” dans la sidebar
      />
      <div className="form-container">
        <StepComponent
          data={formData}
          setData={setFormData}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>
    </div>
  );
}
