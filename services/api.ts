// URL base do backend. Para Android emulador, use http://10.0.2.2:3000
// Para dispositivo físico na mesma rede, use o IP da máquina (ex: http://192.168.0.100:3000)
const BASE_URL = 'http://localhost:3000/api';

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
