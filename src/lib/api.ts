import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isExpectedError = error.config?.url?.includes('leaderboard') && error.response?.status === 404;

    if (!isExpectedError) {
      // ✅ Log as individual arguments to avoid the {} circular reference issue
      console.error("❌ [API ERROR]:", error.message);
      console.error("Status:", error.response?.status);
      console.error("URL:", error.config?.url);
      console.error("Data:", error.response?.data);
    }

    return Promise.reject(error);
  }
);