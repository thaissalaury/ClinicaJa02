import { Router } from 'express';
import { createPaciente, getPacienteMe } from '../controllers/pacienteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de pacientes requerem que o usuário esteja autenticado
router.use(authMiddleware);

router.post('/', createPaciente);
router.get('/me', getPacienteMe);

export default router;
