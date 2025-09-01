const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_TIMEOUT = 10000;
const RETRY_DELAY = 1000;

class ApiError extends Error {
	status: number;
	data?: Error;

	constructor(message: string, status: number, data?: Error) {
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
		...additionalHeaders
	};

	return headers;
}

const handleResponse = async<T>(response: Response): Promise<T> => {
	if (!response.ok) {
		let errorMessage = `HTTP error. Status: ${response.status}`;
		let errorData: Error;

		try {
			errorData = await response.json();
			errorMessage = errorData.message || errorData.name || errorMessage;
		} catch (parseError) {
			errorMessage = parseError || response.statusText || errorMessage;
		}

		throw new ApiError(errorMessage, response.status, errorData);
	}

	try {
		return await response.json();
	} catch (error) {
		throw new ApiError('Invalid JSON response', error);
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

		return await handleResponse(response);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new ApiError('Request Timeout', 408);
			}
			throw new ApiError(error.message, 0);
		}

		throw new ApiError('Unknown error occurred', 0);
	}
};

export const handleApiError = (error: Error): string => {
	if (error instanceof ApiError) {
		return error.message;
	}

	if (error.message) {
		return error.message;
	}

	return 'An unexpected error occurred';
};

export const isNetworkError = (error: Error): boolean => {
	return error instanceof ApiError && error.status === 0;
};

export const isTimeoutError = (error: Error): boolean => {
	return error instanceof ApiError && error.status === 408;
};

export const retryRequest = async <T>(
	requestFn: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = RETRY_DELAY
): Promise<T> => {
	let lastError: Error;

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

