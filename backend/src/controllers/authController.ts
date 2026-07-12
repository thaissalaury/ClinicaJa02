import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabaseClient';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!supabase) {
      return res.status(503).json({
        error: 'Supabase não está configurado. Defina SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env.'
      });
    }

    const authClient = supabaseAdmin || supabase;

    if (!authClient) {
      return res.status(503).json({
        error: 'Supabase não está configurado. Defina SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env.'
      });
    }

    // Registra o usuário no Supabase Auth e já cria a sessão imediatamente.
    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.SUPABASE_REDIRECT_URL || undefined,
        data: {
          email_confirmed: true,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !data.session,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!supabase) {
      return res.status(503).json({
        error: 'Supabase não está configurado. Defina SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env.'
      });
    }

    // Tenta fazer o login com o Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        return res.status(401).json({
          error: 'Confirme seu e-mail antes de entrar.',
          code: 'email_not_confirmed',
        });
      }

      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      session: data.session,
      user: data.user,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
};
