import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';

const fetchApi = axios.create({
  baseURL: `${apiUrl}/api/`,
});

// Interceptor para agregar token Bearer desde NextAuth
fetchApi.interceptors.request.use(async (config) => {
  // Solo agregar token si no es una petición de login/signup
  if (!config.url?.includes('/sign-in') && !config.url?.includes('/sign-up')) {
    try {
      const session = await getSession();
      const token = session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Si no hay sesión, continuar sin token
    }
  }

  return config;
});

// Interceptor para manejar errores de autenticación
fetchApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos un 401 (Unauthorized) y no es una petición de login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si estamos en el cliente (browser)
      if (typeof window !== 'undefined') {
        // Cerrar sesión y redirigir al login
        await signOut({ callbackUrl: '/admin/login' });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export function getAxiosError({ response }) {
  return response?.data?.error || 'Has ocurred an error.';
}

export default fetchApi;
