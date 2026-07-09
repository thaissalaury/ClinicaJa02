-- ==========================================
-- 1. Criação das Tabelas
-- ==========================================

-- Tabela: pacientes
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  sexo TEXT CHECK (sexo IN ('Masculino', 'Feminino', 'Outro')),
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  foto_url TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: medicos
CREATE TABLE public.medicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  crm TEXT UNIQUE NOT NULL,
  uf_crm VARCHAR(2) NOT NULL,
  especialidade TEXT NOT NULL,
  telefone TEXT,
  email TEXT UNIQUE NOT NULL,
  clinica TEXT,
  foto_url TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: consultas
CREATE TABLE public.consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  medico_id UUID NOT NULL REFERENCES public.medicos(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Confirmada', 'Cancelada', 'Realizada')),
  motivo TEXT NOT NULL,
  valor NUMERIC(10, 2), -- Opcional, para futuras integrações de pagamento
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Criação de Índices para Performance
-- ==========================================

CREATE INDEX idx_pacientes_user_id ON public.pacientes(user_id);
CREATE INDEX idx_medicos_user_id ON public.medicos(user_id);
CREATE INDEX idx_consultas_paciente_id ON public.consultas(paciente_id);
CREATE INDEX idx_consultas_medico_id ON public.consultas(medico_id);

-- ==========================================
-- 3. Row Level Security (RLS)
-- ==========================================

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- Políticas para Pacientes
-- Um paciente autenticado pode inserir seu perfil, visualizar seu perfil e atualizá-lo.
CREATE POLICY "Pacientes podem gerenciar seus próprios dados" 
ON public.pacientes
FOR ALL
USING (auth.uid() = user_id);

-- Políticas para Médicos
-- Um médico autenticado pode gerenciar seus próprios dados.
CREATE POLICY "Médicos podem gerenciar seus próprios dados" 
ON public.medicos
FOR ALL
USING (auth.uid() = user_id);

-- Qualquer usuário autenticado (como um paciente) pode ver a lista de médicos para poder agendar consultas.
CREATE POLICY "Usuários autenticados podem ver a lista de médicos" 
ON public.medicos
FOR SELECT
USING (auth.role() = 'authenticated');

-- Políticas para Consultas
-- Pacientes e Médicos podem inserir consultas.
-- Uma consulta só pode ser vista/alterada se o user_id do paciente_id for o logado OU o user_id do medico_id for o logado.
CREATE POLICY "Acesso de Consultas restrito aos envolvidos" 
ON public.consultas
FOR ALL
USING (
  -- Verifica se o usuário atual é o paciente da consulta
  EXISTS (
    SELECT 1 FROM public.pacientes p 
    WHERE p.id = consultas.paciente_id AND p.user_id = auth.uid()
  )
  OR
  -- Verifica se o usuário atual é o médico da consulta
  EXISTS (
    SELECT 1 FROM public.medicos m 
    WHERE m.id = consultas.medico_id AND m.user_id = auth.uid()
  )
);
