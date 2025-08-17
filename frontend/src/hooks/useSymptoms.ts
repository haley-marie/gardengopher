import { Symptom } from "../types/types";
import { useState } from "react"

export const useSymptoms = () => {
	const [symptoms, setSymptoms] = useState<Symptom[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
};
