# TODO - Correção do cadastro (rate limit Supabase Auth)

- [ ] Atualizar `backend/src/controllers/authController.ts`:
  - [ ] Tornar `register` idempotente: checar se o usuário com `email` já existe antes de criar.
  - [ ] Tratar explicitamente `email rate limit exceeded` retornando mensagem clara ao app (sem tentar registrar novamente).
  - [ ] Se usuário existir, tentar login para obter sessão e seguir o fluxo (ou retornar info apropriada).
- [ ] (Opcional) Ajustar mensagens do client para exibir orientação do erro.
- [ ] Validar corrigindo fluxo de cadastro paciente e médico.

