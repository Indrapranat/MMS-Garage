// Base API client configuration
// Saat beralih ke Laravel 13 Sanctum backend, ganti USE_MOCK ke false
// dan arahkan baseURL ke server Laravel (contoh: http://localhost:8000/api/v1)

export const API_CONFIG = {
  USE_MOCK: true,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  TIMEOUT: 10000,
};

// Helper untuk mensimulasikan latensi jaringan API
export const delay = (ms: number = 150) => new Promise((resolve) => setTimeout(resolve, ms));
