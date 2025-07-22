'use client';

import React, { useState, useCallback } from "react";
import { useDiagnosticFlow } from "../hooks/useApi";
import { Plant, Symptom, DiagnosisResult } from "../types";

enum WizardStep {
	PLANT_SELECTION = 'plant_selection',
	SYMPTOM_SELECTION = 'symptom_selection',
	DIAGNOSIS_RESULTS = 'diagnosis_results',
}

interface PlantSelectionStepProps {
	plants: Plant[];
	selectedPlant: Plant | null;
	onPlantSelect: (plant: Plant) => void;
	loading: boolean;
	error: string | null;
}

interface SymptomSelectionStepProps {
	symptoms: Symptom[];
	selectedSymptoms: string[];
	onSymptomToggle: (symptomName: string) => void;
	selectedPlant: Plant;
	loading: boolean;
	error: string | null;
}

interface DiagnosisResultsStepProps {
	results: DiagnosisResult[];
	loading: boolean;
	error: string | null;
	selectedPlant: Plant;
	selectedSymptoms: string[];
}

const PlantSelectionStep: React.FC<PlantSelectionStepProps> = ({
	plants,
	selectedPlant,
	onPlantSelect,
	loading,
	error
}) => {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border b-2 border-green-600"></div>
				<span className="ml-3 text-gray-600">Loading plants...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4">
				<div className="text-red-800">
					<strong>Error loading plants:</strong> {error}
				</div>
			</div>
		);
	}
	return (
		<div className="space-y-4">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Select Your Plant
				</h2>
				<p className="text-gray-600">
					Choose the plant you'd like to diagnose from the list below.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{plants.map((plant) => (
					<button
						key={plant.id}
						onClick={() => onPlantSelect(plant)}
						className={`
              p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
              ${selectedPlant?.id === plant.id
								? 'border-green-500 bg-green-50 shadow-md'
								: 'border-gray-200 hover:border-gray-300'
							}
            `}
					>
						<div className="font-semibold text-gray-800 capitalize">
							{plant.name.replace('_', ' ')}
						</div>
						{plant.scientific_name && (
							<div className="text-sm text-gray-500 italic mt-1">
								{plant.scientific_name}
							</div>
						)}
					</button>
				))}
			</div>
		</div>
	);
}

const SymptomSelectionStep: React.FC<SymptomSelectionStepProps> = ({
	symptoms,
	selectedSymptoms,
	onSymptomToggle,
	selectedPlant,
	loading,
	error
}) => {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
				<span className="ml-3 text-gray-600">Loading symptoms...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4">
				<div className="text-red-800">
					<strong>Error loading symptoms:</strong> {error}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Select Symptoms
				</h2>
				<p className="text-gray-600">
					What symptoms are you observing on your{' '}
					<span className="font-semibold capitalize">
						{selectedPlant.name.replace('_', ' ')}
					</span>?
				</p>
				<div className="mt-2 text-sm text-green-600">
					Selected: {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{symptoms.map((symptom) => (
					<label
						key={symptom.id}
						className={`
              flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${selectedSymptoms.includes(symptom.name)
								? 'border-green-500 bg-green-50'
								: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
							}
            `}
					>
						<input
							type="checkbox"
							checked={selectedSymptoms.includes(symptom.name)}
							onChange={() => onSymptomToggle(symptom.name)}
							className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
						/>
						<div className="ml-3">
							<div className="font-medium text-gray-800">
								{symptom.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
							</div>
							<div className="text-sm text-gray-600 mt-1">
								{symptom.description}
							</div>
						</div>
					</label>
				))}
			</div>
		</div>
	);
};

const DiagnosisResultsStep: React.FC<DiagnosisResultsStepProps> = ({
	results,
	loading,
	error,
	selectedPlant,
	selectedSymptoms
}) => {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
				<span className="ml-3 text-gray-600">Analyzing symptoms...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4">
				<div className="text-red-800">
					<strong>Diagnosis failed:</strong> {error}
				</div>
			</div>
		);
	}

	if (!results || results.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="text-gray-500">
					<h3 className="text-lg font-medium mb-2">No diagnosis found</h3>
					<p>We couldn't identify a specific deficiency based on the selected symptoms.</p>
					<p className="mt-2">Try selecting different symptoms or consult a gardening expert.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Diagnosis Results
				</h2>
				<p className="text-gray-600">
					Based on your{' '}
					<span className="font-semibold capitalize">
						{selectedPlant.name.replace('_', ' ')}
					</span>{' '}
					and the {selectedSymptoms.length} selected symptom{selectedSymptoms.length !== 1 ? 's' : ''}
				</p>
			</div>

			<div className="space-y-4">
				{results.map((result, index) => (
					<div
						key={`${result.deficiency.id}-${index}`}
						className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
					>
						{/* Confidence indicator */}
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold text-gray-800 capitalize">
								{result.deficiency.name.replace('_', ' ')}
							</h3>
							<div className="flex items-center">
								<div className="text-sm text-gray-600 mr-2">Confidence:</div>
								<div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${result.confidence_score >= 0.8
										? 'bg-green-100 text-green-800'
										: result.confidence_score >= 0.6
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'
									}
                `}>
									{Math.round(result.confidence_score * 100)}%
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="mb-4">
							<h4 className="font-medium text-gray-700 mb-2">Description:</h4>
							<p className="text-gray-600">{result.deficiency.description}</p>
						</div>

						{/* Matched symptoms */}
						{result.matched_symptoms && result.matched_symptoms.length > 0 && (
							<div className="mb-4">
								<h4 className="font-medium text-gray-700 mb-2">Matched Symptoms:</h4>
								<div className="flex flex-wrap gap-2">
									{result.matched_symptoms.map((symptom) => (
										<span
											key={symptom}
											className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
										>
											{symptom.replace(/_/g, ' ')}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Treatment */}
						<div className="bg-green-50 border border-green-200 rounded-md p-4">
							<h4 className="font-medium text-green-800 mb-2">Recommended Treatment:</h4>
							<p className="text-green-700">{result.deficiency.treatment}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const DiagnosticWizard: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.PLANT_SELECTION);
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
		submitDiagnosis,
		resetFlow,
	} = useDiagnosticFlow();

	// Navigation handlers
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
						// Error is handled by the hook
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

	// Validation functions
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

	const isFirstStep = currentStep === WizardStep.PLANT_SELECTION;
	const isLastStep = currentStep === WizardStep.DIAGNOSIS_RESULTS;

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* Progress indicator */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{Object.values(WizardStep).map((step, index) => (
						<div
							key={step}
							className={`flex items-center ${index < Object.values(WizardStep).length - 1 ? 'flex-1' : ''}`}
						>
							<div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep === step
									? 'bg-green-600 text-white'
									: Object.values(WizardStep).indexOf(currentStep) > index
										? 'bg-green-200 text-green-800'
										: 'bg-gray-200 text-gray-600'
								}
              `}>
								{index + 1}
							</div>
							{index < Object.values(WizardStep).length - 1 && (
								<div className={`flex-1 h-0.5 mx-4 ${Object.values(WizardStep).indexOf(currentStep) > index
									? 'bg-green-200'
									: 'bg-gray-200'
									}`} />
							)}
						</div>
					))}
				</div>

				<div className="flex justify-between mt-2">
					<span className="text-xs text-gray-600">Select Plant</span>
					<span className="text-xs text-gray-600">Choose Symptoms</span>
					<span className="text-xs text-gray-600">View Results</span>
				</div>
			</div>

			{/* Step content */}
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
					<DiagnosisResultsStep
						results={results?.results || []}
						loading={loading.diagnosis}
						error={error.diagnosis}
						selectedPlant={selectedPlant}
						selectedSymptoms={selectedSymptoms}
					/>
				)}
			</div>

			{/* Navigation buttons */}
			<div className="flex justify-between mt-6">
				<button
					onClick={isLastStep ? handleRestart : handleBack}
					disabled={isFirstStep && !isLastStep}
					className={`
            px-6 py-2 rounded-md font-medium transition-colors duration-200
            ${isFirstStep && !isLastStep
							? 'text-gray-400 cursor-not-allowed'
							: 'text-gray-700 border border-gray-300 hover:bg-gray-50'
						}
          `}
				>
					{isLastStep ? 'Start Over' : 'Back'}
				</button>

				{!isLastStep && (
					<button
						onClick={handleNext}
						disabled={!canProceed() || loading.diagnosis}
						className={`
              px-6 py-2 rounded-md font-medium transition-colors duration-200
              ${canProceed() && !loading.diagnosis
								? 'bg-green-600 text-white hover:bg-green-700'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
							}
            `}
					>
						{loading.diagnosis ? 'Analyzing...' : 'Next'}
					</button>
				)}
			</div>
		</div>
	);
};

export default DiagnosticWizard;
