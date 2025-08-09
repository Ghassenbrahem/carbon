// src/App.js
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StepTransportMatiere from "./components/StepTransportMatiere";
import StepDistribution from "./components/StepDistribution";
import StepGeneral from "./components/StepGeneral";
import StepMatiere from "./components/StepMatiere";
import StepEaux from "./components/StepEaux";
import StepElectricite from "./components/StepElectricite";
import StepEauDouce from "./components/StepEauDouce";
import StepGaz from "./components/StepGaz";
import StepDechets from "./components/StepDechets";
import StepRefroidissement from "./components/StepRefroidissement";
import Summary from "./components/Summary";

import { saveData, loadData } from "./utils/storage";
import { computeTotals } from "./utils/calc";

const steps = [
  { id: "general", label: "Informations générales", component: StepGeneral },
  { id: "matiere", label: "Matières premières", component: StepMatiere },
  { id: "transportMatiere", label: "Transport matières premières", component: StepTransportMatiere },
  { id: "distribution", label: "Distribution", component: StepDistribution },
  { id: "eaux", label: "Eau de décharge", component: StepEaux },
  { id: "refroidissement", label: "Refroidissement", component: StepRefroidissement },
  { id: "electricite", label: "Électricité", component: StepElectricite },
  { id: "eaudouce", label: "Eau ", component: StepEauDouce },
  { id: "gaz", label: "Gaz", component: StepGaz },
  { id: "dechets", label: "Déchets", component: StepDechets },
  { id: "summary", label: "Synthèse", component: Summary }
];

const LAST_INDEX = steps.length - 1;

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => loadData() || {});

  // Totaux recalculés à chaque modification du formulaire
  const { perCategory, grandTotal } = computeTotals(formData);

  useEffect(() => {
    saveData(formData);
  }, [formData]);

  const goTo = (i) => setCurrentStep(Math.max(0, Math.min(i, LAST_INDEX)));
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
    <>
      <Header />
      <div className="app">
        <Sidebar
          steps={steps}
          currentStep={currentStep}
          onStepSelect={goTo}
          onResetAll={resetAll}
          totals={perCategory}     // badges par section
          grandTotal={grandTotal}  // total général (bas de la sidebar)
        />
        <div className="form-container">
          <StepComponent
            data={formData}
            setData={setFormData}
            onNext={onNext}
            onPrev={onPrev}
            sectionTotals={perCategory}
            grandTotal={grandTotal} // ← important pour la barre en bas des pages
          />
        </div>
      </div>
    </>
  );
}
