import { Paciente } from '../types/paciente';
import { mockPacientes } from '../data/mockPacientes';

// Estado local em memória durante a execução do app para permitir alterações temporárias
let pacientesState: Paciente[] = [...mockPacientes];

// Função auxiliar para simular latência de rede (ex: 300ms)
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const pacientesService = {
  /**
   * Retorna a lista de pacientes cadastrados
   */
  async listar(): Promise<Paciente[]> {
    await delay();
    return [...pacientesState];
  },

  /**
   * Cadastra um novo paciente, validando unicidade de CPF
   */
  async cadastrar(paciente: Omit<Paciente, 'id' | 'dataCadastro'>): Promise<Paciente> {
    await delay();

    const cpfFormatado = paciente.cpf.replace(/\D/g, '');
    const cpfJaExiste = pacientesState.some(
      p => p.cpf.replace(/\D/g, '') === cpfFormatado
    );

    if (cpfJaExiste) {
      throw new Error('Já existe um paciente cadastrado com este CPF.');
    }

    const novoPaciente: Paciente = {
      ...paciente,
      id: Math.random().toString(36).substring(2, 9),
      dataCadastro: new Date().toISOString(),
    };

    pacientesState.push(novoPaciente);
    
    // LOG DE HOMOLOGAÇÃO: Imprime a lista de pacientes atualizada no terminal
    console.log('\n=== [DEBUG] PACIENTE CADASTRADO COM SUCESSO ===');
    console.log(JSON.stringify(pacientesState, null, 2));
    console.log('================================================\n');

    return novoPaciente;
  },

  /**
   * Atualiza dados de um paciente existente
   */
  async atualizar(id: string, dados: Partial<Omit<Paciente, 'id' | 'dataCadastro'>>): Promise<Paciente> {
    await delay();

    const index = pacientesState.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Paciente não encontrado.');
    }

    // Se estiver atualizando o CPF, verificar se já existe outro paciente com o mesmo CPF
    if (dados.cpf) {
      const cpfFormatado = dados.cpf.replace(/\D/g, '');
      const cpfJaExiste = pacientesState.some(
        p => p.id !== id && p.cpf.replace(/\D/g, '') === cpfFormatado
      );
      if (cpfJaExiste) {
        throw new Error('Já existe outro paciente cadastrado com este CPF.');
      }
    }

    const pacienteAtualizado = {
      ...pacientesState[index],
      ...dados,
    };

    pacientesState[index] = pacienteAtualizado;
    return pacienteAtualizado;
  },

  /**
   * Remove um paciente pelo ID
   */
  async remover(id: string): Promise<boolean> {
    await delay();

    const index = pacientesState.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Paciente não encontrado.');
    }

    pacientesState.splice(index, 1);
    return true;
  },
};
