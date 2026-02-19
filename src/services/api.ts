import axios, { AxiosInstance, AxiosError } from 'axios';

// API Response wrapper
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Pagination response
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Extract data from ApiResponse wrapper
    const apiResponse = response.data as ApiResponse;

    // If code is not 0, treat as error
    if (apiResponse.code !== 0) {
      return Promise.reject({
        code: apiResponse.code,
        message: apiResponse.message,
        data: apiResponse.data,
      });
    }

    // Return the actual data
    return apiResponse.data;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (error.response) {
      const apiResponse = error.response.data as ApiResponse;
      return Promise.reject({
        code: apiResponse?.code || error.response.status,
        message: apiResponse?.message || error.message,
        data: apiResponse?.data,
      });
    }

    return Promise.reject({
      code: -1,
      message: error.message || '网络错误',
      data: null,
    });
  }
);

export default api;
