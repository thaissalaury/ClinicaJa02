import { Medico } from '../types/medico';
import { mockMedicos } from '../data/mockMedicos';

// Estado local em memória durante a execução do app para permitir alterações temporárias
let medicosState: Medico[] = [...mockMedicos];

// Função auxiliar para simular latência de rede (ex: 300ms)
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const medicosService = {
  /**
   * Retorna a lista de médicos cadastrados
   */
  async listar(): Promise<Medico[]> {
    await delay();
    return [...medicosState];
  },

  /**
   * Cadastra um novo médico, validando unicidade de CRM + UF
   */
  async cadastrar(medico: Omit<Medico, 'id' | 'dataCadastro'>): Promise<Medico> {
    await delay();

    const crmLimpo = medico.crm.trim();
    const ufLimpa = medico.ufCrm.trim().toUpperCase();

    const crmJaExiste = medicosState.some(
      m => m.crm.trim() === crmLimpo && m.ufCrm.trim().toUpperCase() === ufLimpa
    );

    if (crmJaExiste) {
      throw new Error(`Já existe um médico cadastrado com o CRM ${crmLimpo} nesta UF (${ufLimpa}).`);
    }

    const novoMedico: Medico = {
      ...medico,
      crm: crmLimpo,
      ufCrm: ufLimpa,
      id: Math.random().toString(36).substring(2, 9),
      dataCadastro: new Date().toISOString(),
    };

    medicosState.push(novoMedico);
    return novoMedico;
  },

  /**
   * Atualiza dados de um médico existente
   */
  async atualizar(id: string, dados: Partial<Omit<Medico, 'id' | 'dataCadastro'>>): Promise<Medico> {
    await delay();

    const index = medicosState.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Médico não encontrado.');
    }

    // Se estiver atualizando CRM + UF, verificar se já existe outro médico com os mesmos dados
    const crmFinal = dados.crm ? dados.crm.trim() : medicosState[index].crm;
    const ufFinal = dados.ufCrm ? dados.ufCrm.trim().toUpperCase() : medicosState[index].ufCrm;

    if (dados.crm || dados.ufCrm) {
      const crmJaExiste = medicosState.some(
        m => m.id !== id && m.crm.trim() === crmFinal && m.ufCrm.trim().toUpperCase() === ufFinal
      );
      if (crmJaExiste) {
        throw new Error(`Já existe outro médico cadastrado com o CRM ${crmFinal} nesta UF (${ufFinal}).`);
      }
    }

    const medicoAtualizado = {
      ...medicosState[index],
      ...dados,
      crm: crmFinal,
      ufCrm: ufFinal,
    };

    medicosState[index] = medicoAtualizado;
    return medicoAtualizado;
  },

  /**
   * Remove um médico pelo ID
   */
  async remover(id: string): Promise<boolean> {
    await delay();

    const index = medicosState.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Médico não encontrado.');
    }

    medicosState.splice(index, 1);
    return true;
  },
};
