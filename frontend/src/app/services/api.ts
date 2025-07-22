import {
	Plant,
	Symptom,
	DiagnosisRequest,
	DiagnosisResponse,
	ApiResponse,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_TIMEOUT = 10000;

class ApiError extends Error {
	status: number;
	data?: any;

	constructor(message: string, status: number, data?: any) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

const fetchWithTimeout = async (
	url: string,
	options: RequestInit = {},
	timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
};

const createHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...additionalHeaders,
	};

	// add auth token if available
	const token = localStorage.getItem('auth_token');
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		let errorMessage = `HTTP error! status: ${response.status}`;
		let errorData;

		try {
			errorData = await response.json();
			errorMessage = errorData.message || errorData.error || errorMessage;
		} catch (parseError) {
			errorMessage = response.statusText || errorMessage;
		}

		if (response.status === 401) {
			localStorage.removeItem('auth_token');
			window.location.href = '/login';
		}

		throw new ApiError(errorMessage, response.status, errorData);
	}

	try {
		return await response.json();
	} catch (error) {
		throw new ApiError('Invalid JSON response', response.status);
	}
};

const apiRequest = async <T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> => {
	const url = `${API_BASE_URL}${endpoint}`;
	const headers = createHeaders(options.headers as Record<string, string>);

	try {
		const response = await fetchWithTimeout(url, {
			...options,
			headers,
		});

		return await handleResponse<T>(response);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new ApiError('Request timeout', 408);
			}
			throw new ApiError(error.message, 0);
		}

		throw new ApiError('Unknown error occurred', 0);
	}
};

export const api = {
	plants: {
		getAll: async (): Promise<Plant[]> => {
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
		},

		getById: async (id: number): Promise<Plant> => {
			try {
				const response = await apiRequest<ApiResponse<Plant>>(`/api/plants/${id}`);

				if (response.success) {
					return response.data;
				} else {
					throw new ApiError(response.message || 'Failed to fetch plant', 400);
				}
			} catch (error) {
				console.error(`Error fetching plant with id ${id}:`, error);
				throw error;
			}
		},
	},

	symptoms: {
		getAll: async (): Promise<Symptom[]> => {
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
		},

		getById: async (id: number): Promise<Symptom> => {
			try {
				const response = await apiRequest<ApiResponse<Symptom>>(`/api/symptoms/${id}`);

				if (response.success) {
					return response.data;
				} else {
					throw new ApiError(response.message || 'Failed to fetch symptom', 400);
				}
			} catch (error) {
				console.error(`Error fetching symptom with id ${id}:`, error);
				throw error;
			}
		},
	},

	diagnosis: {
		diagnose: async (request: DiagnosisRequest): Promise<DiagnosisResponse> => {
			try {
				const response = await apiRequest<DiagnosisResponse>('/api/diagnose', {
					method: 'POST',
					body: JSON.stringify(request),
				});

				return response;
			} catch (error) {
				console.error('Error diagnosing plant:', error);
				throw error;
			}
		},
	},
};

export const handleApiError = (error: any): string => {
	if (error instanceof ApiError) {
		return error.message
	}

	if (error.message) {
		return error.message;
	}

	return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
	return error instanceof ApiError && error.status === 0;
};

export const isTimeoutError = (error: any): boolean => {
	return error instanceof ApiError && error.status === 408;
};

export const retryRequest = async <T>(
	requestFn: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = 1000
): Promise<T> => {
	let lastError: any;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await requestFn();
		} catch (error) {
			lastError = error;

			if (i < maxRetries - 1) {
				await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
			}
		}
	}

	throw lastError;
};

export { apiRequest };
export { ApiError };
export default api;
