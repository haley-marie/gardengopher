import { useCallback, useState } from "react"
import { DiagnosisResponse, DiagnosisRequest } from "@/types/types";
import { diagnosis } from "@/api/diagnose/route";
import { handleApiError } from "@/api/api";

export const useDiagnosis = () => {
	const [results, setResults] = useState<DiagnosisResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const diagnose = useCallback(async (request: DiagnosisRequest) => {
		try {
			setLoading(true);
			setError(null);

			const response = await diagnosis(request)
			setResults(response);
		} catch (err) {
			setError(handleApiError(err));
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);


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
