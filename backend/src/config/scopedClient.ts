import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY no arquivo .env');
}

/**
 * Cria uma instância do Supabase com o token do usuário logado.
 * Isso garante que as regras de segurança (RLS) do banco de dados sejam aplicadas corretamente
 * de acordo com o usuário que está fazendo a requisição.
 */
export const getScopedClient = (token: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};
