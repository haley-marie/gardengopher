import { DiagnosisResponse, DiagnosisRequest } from "@/types/types";;
import { apiRequest } from "../api";

export const diagnose = async (request: DiagnosisRequest): Promise<DiagnosisResponse> => {
	try {
		const response = await apiRequest<DiagnosisResponse>('api/diagnose', {
			method: 'POST',
			body: JSON.stringify(request),
		});

		return response;
	} catch (error) {
		console.error('Error diagnosing plant:', error);
		throw error;
	}
};
