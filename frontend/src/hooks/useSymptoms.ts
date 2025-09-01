import { Symptom } from "../types/types";
import { useCallback, useEffect, useState } from "react"
import { getAllSymptoms } from "@/api/symptoms/route";
import { handleApiError } from "@/api/api";

export const useSymptoms = () => {
	const [symptoms, setSymptoms] = useState<Symptom[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSymptoms = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getAllSymptoms();
			const normalized: Symptom[] = data.map((s: Symptom) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				created_at: s.created_at,
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
	}
};
