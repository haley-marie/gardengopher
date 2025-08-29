import { ErrorState, LoadingState, Plant } from "@/types/types";
import { usePlants } from "./usePlants";
import { useSymptoms } from "./useSymptoms";
import { useCallback, useState } from "react";
import { useDiagnosis } from "./useDiagnosis";

export const useDiagnosticFlow = () => {
	const plantsState = usePlants();
	const symptomState = useSymptoms();
	const diagnosisState = useDiagnosis();

	const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

	const loadingState: LoadingState = {
		plants: plantsState.loading,
		symptoms: symptomState.loading,
		diagnosis: diagnosisState.loading
	}

	const errorState: ErrorState = {
		plants: plantsState.error,
		symptoms: symptomState.error,
		diagnosis: diagnosisState.error,
	}

	const isAnyLoading = Object.values(loadingState).some(Boolean);
	const hasAnyError = Object.values(errorState).some(Boolean)

	const submitDiagnosis = useCallback(async () => {
		if (!selectedPlant || selectedSymptoms.length === 0) {
			throw new Error('Please select a plant and at least one symptom');
		}

		return await diagnosisState.diagnose({
			plant_id: selectedPlant.id,
			symptoms: selectedSymptoms,
		});
	}, [selectedPlant, selectedSymptoms, diagnosisState]);

	const resetFlow = useCallback(() => {
		setSelectedPlant(null);
		setSelectedSymptoms([]);
		diagnosisState.clearResults();
	}, [diagnosisState]);

	const addSymptom = useCallback((symptomName: string) => {
		setSelectedSymptoms(prev =>
			prev.includes(symptomName)
				? prev
				: [...prev, symptomName]
		);
	}, []);

	const removeSymptom = useCallback((symptomName: string) => {
		setSelectedSymptoms(prev => prev.filter(name => name !== symptomName));
	}, []);

	const toggleSymptom = useCallback((symptomName: string) => {
		setSelectedSymptoms(prev =>
			prev.includes(symptomName)
				? prev.filter(name => name !== symptomName)
				: [...prev, symptomName]
		)
	}, []);

	return {
		plants: plantsState.plants,
		symptoms: symptomState.symptoms,
		results: diagnosisState.results,

		selectedPlant,
		selectedSymptoms,

		loading: loadingState,
		error: errorState,
		isAnyLoading,
		hasAnyError,

		setSelectedPlant,
		addSymptom,
		removeSymptom,
		toggleSymptom,
		submitDiagnosis,
		resetFlow,

		refetchPlants: plantsState.refetch,
		refetchSymptoms: symptomState.refetch,
	};
}
