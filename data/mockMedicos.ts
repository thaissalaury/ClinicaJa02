import { Medico } from '../types/medico';

export const mockMedicos: Medico[] = [
  {
    id: '1',
    nome: 'Dr. Roberto Oliveira',
    crm: '123456',
    ufCrm: 'SP',
    especialidade: 'Cardiologia',
    telefone: '(11) 97654-3210',
    email: 'roberto.oliveira@clinicaja.com.br',
    clinica: 'Clínica Central SP',
    dataCadastro: '2026-01-05T08:00:00.000Z',
  },
  {
    id: '2',
    nome: 'Dra. Beatriz Santos',
    crm: '654321',
    ufCrm: 'RJ',
    especialidade: 'Pediatria',
    telefone: '(21) 98543-2109',
    email: 'beatriz.santos@clinicaja.com.br',
    clinica: 'Clínica Barra Saúde',
    dataCadastro: '2026-02-20T10:30:00.000Z',
  },
];
