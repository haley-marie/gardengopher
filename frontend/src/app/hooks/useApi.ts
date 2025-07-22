import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../services/api'
import {
	Plant,
	Symptom,
	DiagnosisRequest,
	DiagnosisResponse,
	LoadingState,
	ErrorState,
} from '../types';

export const usePlants = () => {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlants = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.plants.getAll();
			const normalized = data.map((p: any) => ({
				id: p.ID,
				name: p.Name,
				scientific_name: p.ScientificName,
				created_at: p.CreatedAt,
			}));
			setPlants(normalized);
		} catch (err) {
			setError(handleApiError(err));
		} finally {
			setLoading(false);
		}
	}, []);


	useEffect(() => {
		fetchPlants();
	}, [fetchPlants]);

	return {
		plants,
		loading,
		error,
		refetch: fetchPlants,
	};
};

export const useSymptoms = () => {
	const [symptoms, setSymptoms] = useState<Symptom[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSymptoms = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.symptoms.getAll();
			const normalized: Symptom[] = data.map((s: any) => ({
				id: s.ID,
				name: s.Name,
				description: s.Description,
				created_at: s.CreatedAt,
			}));
			setSymptoms(normalized);
		} catch (err) {
			setError(handleApiError(err));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSymptoms();
	}, [fetchSymptoms]);

	return {
		symptoms,
		loading,
		error,
		refetch: fetchSymptoms,
	};
};

export const useDiagnosis = () => {
	const [results, setResults] = useState<DiagnosisResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const diagnose = useCallback(async (request: DiagnosisRequest) => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.diagnosis.diagnose(request);
			setResults(response);
		} catch (err) {
			setError(handleApiError(err));
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);
	const [symptoms, setSymptoms] = useState<Symptom[]>([]);
	const clearResults = useCallback(() => {
		setResults(null);
		setError(null);
	}, []);

	return {
		results,
		loading,
		error,
		diagnose,
		clearResults,
	};
};

export const useDiagnosticFlow = () => {
	const plantsState = usePlants();
	const symptomState = useSymptoms();
	const diagnosisState = useDiagnosis();

	const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

	const loadingState: LoadingState = {
		plants: plantsState.loading,
		symptoms: symptomState.loading,
		diagnosis: diagnosisState.loading,
	};

	const errorState: ErrorState = {
		plants: plantsState.error,
		symptoms: symptomState.error,
		diagnosis: diagnosisState.error,
	};

	const isAnyLoading = Object.values(loadingState).some(Boolean);
	const hasAnyError = Object.values(errorState).some(Boolean);

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
		);
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
};

export const useAsyncOperation = <T extends any[], R>(
	operation: (...args: T) => Promise<R>
) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = useCallback(async (...args: T): Promise<R | null> => {
		try {
			setLoading(true);
			setError(null);
			const result = await operation(...args);
			return result;
		} catch (err) {
			const errorMessage = handleApiError(err);
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	}, [operation]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		loading,
		error,
		execute,
		clearError,
	};
};
