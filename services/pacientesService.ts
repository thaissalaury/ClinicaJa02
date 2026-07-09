import { Paciente } from '../types/paciente';
import { apiRequest } from './api';

export const pacientesService = {
  /**
   * Cadastra um novo paciente.
   * Fluxo: 1) Registra no Supabase Auth → 2) Cria o perfil na tabela pacientes
   */
  async cadastrar(
    paciente: Omit<Paciente, 'id' | 'dataCadastro'> & { senha: string }
  ): Promise<Paciente> {
    // 1. Registrar no Supabase Auth
    const authResult = await apiRequest('/auth/register', 'POST', {
      email: paciente.email,
      password: paciente.senha,
    });

    if (!authResult.ok) {
      throw new Error(authResult.error || 'Erro ao registrar usuário.');
    }

    // 2. Fazer login para obter o token de sessão
    const loginResult = await apiRequest('/auth/login', 'POST', {
      email: paciente.email,
      password: paciente.senha,
    });

    if (!loginResult.ok) {
      throw new Error(loginResult.error || 'Erro ao autenticar usuário.');
    }

    const token = loginResult.data.session.access_token;

    // 3. Criar o perfil do paciente com o token
    const perfilResult = await apiRequest('/pacientes', 'POST', {
      nome: paciente.nome,
      cpf: paciente.cpf,
      data_nascimento: paciente.dataNascimento,
      email: paciente.email,
      telefone: paciente.telefone,
      sexo: paciente.sexo,
      cep: paciente.cep,
      endereco: paciente.endereco,
      numero: paciente.numero,
      complemento: paciente.complemento || null,
      bairro: paciente.bairro,
      cidade: paciente.cidade,
      estado: paciente.estado,
    }, token);

    if (!perfilResult.ok) {
      throw new Error(perfilResult.error || 'Erro ao salvar perfil do paciente.');
    }

    console.log('\n=== [DEBUG] PACIENTE CADASTRADO NO SUPABASE ===');
    console.log(JSON.stringify(perfilResult.data, null, 2));
    console.log('================================================\n');

    return perfilResult.data.paciente;
  },

  /**
   * Busca os dados do paciente logado
   */
  async buscarMeuPerfil(token: string): Promise<Paciente> {
    const result = await apiRequest('/pacientes/me', 'GET', undefined, token);

    if (!result.ok) {
      throw new Error(result.error || 'Erro ao buscar perfil.');
    }

    return result.data;
  },
};
