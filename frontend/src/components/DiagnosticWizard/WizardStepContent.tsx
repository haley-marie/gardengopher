'use client'

import { WizardStep } from "@/types/types";
import PlantSelectionStep from "./PlantSelectionStep";
import SymptomSelectionStep from "./SymptomSelectionStep";
import { useDiagnosticFlow } from "@/hooks/useDiagnosticFlow";
import DiagnosisResultStep from "./DiagnosisResultStep";
import { useState } from "react";


const WizardStepContent = () => {
	const [currentStep, _] = useState<WizardStep>(WizardStep.PLANT_SELECTION);

	const {
		plants,
		symptoms,
		results,
		selectedPlant,
		selectedSymptoms,
		loading,
		error,
		setSelectedPlant,
		toggleSymptom,
	} = useDiagnosticFlow();

	return (
		<div className="bg-white rounded-lg shadow-sm border p-6 min-h-96">
			{currentStep === WizardStep.PLANT_SELECTION && (
				<PlantSelectionStep
					plants={plants}
					selectedPlant={selectedPlant}
					onPlantSelect={setSelectedPlant}
					loading={loading.plants}
					error={error.plants}
				/>
			)}

			{currentStep === WizardStep.SYMPTOM_SELECTION && selectedPlant && (
				<SymptomSelectionStep
					symptoms={symptoms}
					selectedSymptoms={selectedSymptoms}
					onSymptomToggle={toggleSymptom}
					selectedPlant={selectedPlant}
					loading={loading.symptoms}
					error={error.symptoms}
				/>
			)}

			{currentStep === WizardStep.DIAGNOSIS_RESULTS && selectedPlant && (
				<DiagnosisResultStep
					results={results?.results || []}
					loading={loading.diagnosis}
					error={error.diagnosis}
					selectedPlant={selectedPlant}
					selectedSymptoms={selectedSymptoms}
				/>
			)}
		</div>
	);
};

export default WizardStepContent;
