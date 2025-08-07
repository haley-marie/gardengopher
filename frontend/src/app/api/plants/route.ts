import { Plant, ApiResponse } from '../../types';
import { ApiError, apiRequest } from './api';

export const getAllPlants = async (): Promise<Plant[]> => {
	try {
		const response = await apiRequest<ApiResponse<Plant[]>>('/api/plants');

		if (response.success) {
			return response.data;
		} else {
			throw new ApiError(response.message || 'Failed to fetch plants', 400);
		}
	} catch (error) {
		console.error('Error fetching plants:', error);
		throw error;
	}
};

export const getPlantById = async (id: number): Promise<Plant> => {
	try {
		const response = await apiRequest<ApiResponse<Plant>>(`/api/plants/${id}`);

		if (response.success) {
			return response.data;
		} else {
			throw new ApiError(response.message || 'Failed to fetch plant', 400);
		}
	} catch (error) {
		console.error(`Error fetching plant with id ${id}`, error);
		throw error;
	}
};
