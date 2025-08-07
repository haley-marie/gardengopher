import { Symptom, ApiResponse } from '../../types';
import { ApiError, apiRequest } from './api';

export const getAllSymptoms = async (): Promise<Symptom[]> => {
	try {
		const response = await apiRequest<ApiResponse<Symptom[]>>('/api/symptoms');

		if (response.success) {
			return response.data;
		} else {
			throw new ApiError(response.message || 'Failed to fetch symptoms', 400);
		}
	} catch (error) {
		console.error('Error fetching symptoms:', error);
		throw error;
	}
};

export const getSymptomById = async (id: number): Promise<Symptom> => {
	try {
		const response = await apiRequest<ApiResponse<Symptom>>(`/api/symptoms/${id}`);

		if (response.success) {
			return response.data;
		} else {
			throw new ApiError(response.message || 'Failed to fetch symptom', 400);
		}
	} catch (error) {
		console.error(`Error fetching symptom with id ${id}`, error);
		throw error;
	}
};
