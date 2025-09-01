'use client'

import { useCallback, useState } from "react";
import { WizardStep } from "@/types/types";
import { useDiagnosticFlow } from "@/hooks/useDiagnosticFlow";


const NavButtons = () => {
	const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.PLANT_SELECTION);
	const isFirstStep = currentStep === WizardStep.PLANT_SELECTION;
	const isLastStep = currentStep === WizardStep.DIAGNOSIS_RESULTS;

	const {
		selectedPlant,
		selectedSymptoms,
		loading,
		submitDiagnosis,
		resetFlow,
	} = useDiagnosticFlow();

	const canProceed = useCallback(() => {
		switch (currentStep) {
			case WizardStep.PLANT_SELECTION:
				return selectedPlant !== null;

			case WizardStep.SYMPTOM_SELECTION:
				return selectedSymptoms.length > 0;

			default:
				return false;
		}
	}, [currentStep, selectedPlant, selectedSymptoms]);

	const handleNext = useCallback(async () => {

		switch (currentStep) {

			case WizardStep.PLANT_SELECTION:
				if (selectedPlant) {
					setCurrentStep(WizardStep.SYMPTOM_SELECTION);
				}
				break;

			case WizardStep.SYMPTOM_SELECTION:
				if (selectedSymptoms.length > 0) {
					try {
						await submitDiagnosis();
						setCurrentStep(WizardStep.DIAGNOSIS_RESULTS);
					} catch (err) {
						// Error is handled by hook
						console.error('Diagnosis failed:', err);
					}
				}
				break;
		}
	}, [currentStep, selectedPlant, selectedSymptoms, submitDiagnosis]);

	const handleBack = useCallback(() => {
		switch (currentStep) {
			case WizardStep.SYMPTOM_SELECTION:
				setCurrentStep(WizardStep.PLANT_SELECTION);
				break;
			case WizardStep.DIAGNOSIS_RESULTS:
				setCurrentStep(WizardStep.SYMPTOM_SELECTION);
				break;
		}
	}, [currentStep]);

	const handleRestart = useCallback(() => {
		resetFlow();
		setCurrentStep(WizardStep.PLANT_SELECTION);
	}, [resetFlow]);

	return (
		<div className="flex justify-between mt-6">
			<button
				onClick={isLastStep ? handleRestart : handleBack}
				disabled={isFirstStep && !isLastStep}
				className={`
            						px-6 py-2 rounded-md font-medium transition-colors duration-200
            						${isFirstStep && !isLastStep
						? 'text-gray-400 cursor-not-allowed'
						: 'text-gray-700 border border-gray-300 hover:bg-gray-50'
					}`}
			>
				{isLastStep ? 'Start Over' : 'Back'}
			</button>

			{!isLastStep && (
				<button
					onClick={handleNext}
					disabled={!canProceed() || loading.plants}
					className={`
              							px-6 py-2 rounded-md font-medium transition-colors duration-200
              							${canProceed() && !loading.diagnosis
							? 'bg-green-600 text-white hover:bg-green-700'
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
				>
					{loading.plants ? 'Analyzing...' : 'Next'}
				</button>
			)}
		</div>
	);
}

export default NavButtons;
