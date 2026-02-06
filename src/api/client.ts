import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { config } from '@/config';

/**
 * API Error Type
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * API Response wrapper type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Creates and configures an Axios instance with interceptors
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
  });

  // Request interceptor
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      // Get token from storage (if using token-based auth)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return requestConfig;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized - Token refresh logic
      if (error.response?.status === 401 && originalRequest) {
        // Add your token refresh logic here
        // Example:
        // try {
        //   const newToken = await refreshToken();
        //   localStorage.setItem('accessToken', newToken);
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   return client(originalRequest);
        // } catch (refreshError) {
        //   // Redirect to login
        //   window.location.href = '/login';
        // }
      }

      // Transform error to a consistent format
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
        details: error.response?.data?.details,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
}

/**
 * Singleton API client instance
 */
export const apiClient = createApiClient();

/**
 * HTTP method helpers with proper typing
 */
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) => apiClient.delete<T>(url).then((res) => res.data),
};
