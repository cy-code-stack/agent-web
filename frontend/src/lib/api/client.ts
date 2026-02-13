import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { ApiError, ApiResponse } from "@/types";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${state.tokens.accessToken}`;
        }
      } catch {
        // Invalid storage data
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state?.tokens?.refreshToken) {
            const response = await axios.post<
              ApiResponse<{ accessToken: string; refreshToken: string }>
            >(`${API_BASE_URL}/auth/refresh`, {
              refreshToken: state.tokens.refreshToken,
            });

            const { accessToken, refreshToken } = response.data.data;

            // Update stored tokens
            const updatedState = {
              ...state,
              tokens: {
                ...state.tokens,
                accessToken,
                refreshToken,
              },
            };
            localStorage.setItem(
              "auth-storage",
              JSON.stringify({ state: updatedState })
            );

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch {
          // Refresh failed - logout user
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
        }
      }
    }

    // Format error response
    const apiError: ApiError = {
      code: error.response?.data?.code || "UNKNOWN_ERROR",
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
