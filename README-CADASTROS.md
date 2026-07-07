# ClínicaJá - Módulo de Cadastros (Pacientes e Médicos)

Este documento descreve a arquitetura, estrutura e o funcionamento do módulo de cadastros implementado na branch `feature/cadastro-pacientes-medicos`. Ele serve como guia para que qualquer integrante da equipe possa entender, manter e integrar este módulo com o banco de dados Supabase futuramente.

---

## 1. Estrutura de Pastas e Responsabilidades

O módulo foi estruturado de forma isolada e modularizada, seguindo o padrão do restante do projeto:

```text
ClinicaJa/
├── app/
│   ├── cadastro-paciente.tsx   # Tela de formulário de cadastro de pacientes
│   ├── cadastro-medico.tsx     # Tela de formulário de cadastro de médicos
├── components/
│   └── form/
│       ├── FormInput.tsx       # Input de formulário reutilizável com foco/tema/validação
│       └── FormDropdown.tsx    # Seletor dropdown personalizado com modal
├── data/
│   ├── mockPacientes.ts        # Dados estáticos simulados de pacientes
│   └── mockMedicos.ts          # Dados estáticos simulados de médicos
├── services/
│   ├── pacientesService.ts     # Camada de negócios e manipulação de pacientes (async)
│   └── medicosService.ts       # Camada de negócios e manipulação de médicos (async)
├── types/
│   ├── paciente.ts             # Tipagem estrita da entidade Paciente
│   └── medico.ts               # Tipagem estrita da entidade Medico
└── utils/
    ├── masks.ts                # Máscaras de entrada (CPF, Telefone, CEP, Data)
    └── validators.ts           # Validadores matemáticos e de formato (CPF, E-mail, CEP)
```

---

## 2. Fluxo da Aplicação

A arquitetura segue rigorosamente um fluxo unidirecional desacoplado:

```text
  [Tela (View)]  ──>  [Service]  ──>  [Mocks / Persistência]
```

1. **Tela (View)**: Captura as entradas do usuário, aplica máscaras durante a digitação via `utils/masks.ts` e despacha os dados ao respectivo Service de forma assíncrona.
2. **Service**: Executa validações de regras de negócios (como CPF duplicado ou CRM/UF duplicado) e gerencia a persistência.
3. **Mocks**: Armazenam temporariamente em memória o estado dos dados em execução. As telas **nunca** acessam ou modificam os Mocks diretamente.

---

## 3. Funcionamento Técnico

### Services (Métodos Assíncronos)
Tanto o `pacientesService` quanto o `medicosService` expõem os seguintes métodos assíncronos que simulam requisições de rede utilizando `Promise` e `setTimeout` (latência de 300ms):
* `listar()`: Retorna um array do tipo da entidade correspondente.
* `cadastrar(dado)`: Valida regras de exclusividade de chaves únicas, gera um ID aleatório, data de cadastro e insere o registro.
* `atualizar(id, novosDados)`: Atualiza propriedades específicas de um item pelo ID.
* `remover(id)`: Exclui o registro associado.

### Mocks
Armazenados em `data/mockPacientes.ts` e `data/mockMedicos.ts` como arrays tipados de dados. A persistência temporária é gerada em memória por um estado mantido no escopo do arquivo do service (ex: `let pacientesState = [...mockPacientes]`).

### Components (FormInput & FormDropdown)
* **FormInput**: Componente que recebe propriedades padrões de `TextInput` do React Native estendidas com `label`, `iconName` (Ionicons), `error` (exibe mensagem vermelha caso haja erro) e `mask` (aplica a máscara durante a digitação). Possui alteração de cor de borda inteligente e suave quando está focado ou quando apresenta erro.
* **FormDropdown**: Fornece um modal nativo para listagem de opções. Apresenta o item selecionado e permite fechar ou escolher itens em uma lista rolável que acompanha o tema Dark/Light ativo.

### Utils
* **validador de CPF**: Implementado em `utils/validators.ts` utilizando a validação matemática oficial do primeiro e segundo dígito verificador.
* **validador de data**: Confirma se a data informada é válida no calendário (validando meses com 30/31 dias e anos bissextos) e barra datas no futuro.

---

## 4. Guia de Integração com o Supabase

Quando outro integrante for integrar o banco de dados Supabase neste módulo, **não haverá necessidade de alterar as telas ou os componentes**. Bastará modificar a implementação interna dos métodos dos Services.

### Exemplo de Substituição

Atualmente, o método de cadastrar pacientes funciona assim:

```typescript
// Em services/pacientesService.ts
async cadastrar(paciente: Omit<Paciente, 'id' | 'dataCadastro'>): Promise<Paciente> {
  await delay();
  // ... lógica de validação no array local
  pacientesState.push(novoPaciente);
  return novoPaciente;
}
```

Para integrar com o **Supabase**, basta substituir por:

```typescript
import { supabase } from './supabaseClient'; // Seu cliente do Supabase

async cadastrar(paciente: Omit<Paciente, 'id' | 'dataCadastro'>): Promise<Paciente> {
  const { data, error } = await supabase
    .from('pacientes')
    .insert([paciente])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Paciente;
}
```

As telas (`app/cadastro-paciente.tsx` e `app/cadastro-medico.tsx`) que chamam `await pacientesService.cadastrar(...)` continuarão funcionando perfeitamente sem alteração de nenhuma linha de código visual.

---

## 5. Como Estender o Módulo

### A) Adicionar novos campos no formulário
1. Adicione o campo no tipo TypeScript correspondente (`types/paciente.ts` ou `types/medico.ts`).
2. Atualize a estrutura do Mock para refletir o novo campo.
3. Na tela de formulário correspondente, crie um estado (`useState`) para o novo campo.
4. Adicione um novo `<FormInput>` ou `<FormDropdown>` na renderização, ligando o valor ao seu respectivo estado.
5. Adicione a validação em `validarCampos()` se o campo for obrigatório.
6. Adicione o campo no payload enviado ao método do Service.

### B) Adicionar novas validações
1. Crie a função pura de validação em `utils/validators.ts`.
2. Importe-a na tela correspondente.
3. No método `validarCampos()`, adicione a regra e defina a mensagem de erro no estado correspondente (ex: `novosErros.campo = 'Mensagem de erro'`).

### C) Criar um novo formulário
1. Crie a tipagem em `types/`.
2. Crie o Mock de dados iniciais em `data/`.
3. Crie o Service com métodos CRUD assíncronos em `services/`.
4. Crie a tela em `app/` utilizando os componentes reutilizáveis `<FormInput>` e `<FormDropdown>`.
