import axios, { AxiosError } from "axios";
import { AxiosRequestConfig } from "node_modules/axios/index.cjs";

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;
const MAX_DELAY = 30_000;

const baseURL =
  typeof window === "undefined"
    ? "http://localhost"
    : import.meta.env.VITE_API_BASE ?? "/";

export const http = axios.create({
  baseURL,
  timeout: 8000,
});

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

function isRetryableStatus(status: number | undefined): boolean {
  if (!status) return false;
  return status === 429 || (status >= 500 && status < 600);
}

function calculateDelay(retryCount: number): number {
  return Math.min(BASE_RETRY_DELAY * Math.pow(2, retryCount - 1), MAX_DELAY);
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: RetryConfig }) => {
    const config = error.config as RetryConfig | undefined;

    if (!config) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const shouldRetry = isRetryableStatus(status);

    if (shouldRetry) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= MAX_RETRIES) {
        const delay = calculateDelay(config._retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return http(config);
      }
    }

    return Promise.reject(error);
  }
);
