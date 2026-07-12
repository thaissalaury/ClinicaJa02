
const FALLBACK_IP = '192.168.100.69';

const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }

  return `http://${FALLBACK_IP}:3000/api`;
};

const BASE_URL = getBaseUrl();

interface ApiResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

/**
 * Função genérica para chamadas à API do backend.
 * Centraliza headers, tratamento de erros e parsing do JSON.
 */
export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any,
  token?: string
): Promise<ApiResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Erro desconhecido no servidor' };
    }

    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, error: 'Não foi possível conectar ao servidor. Verifique sua conexão.' };
  }
}
