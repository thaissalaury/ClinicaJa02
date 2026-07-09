import { Router } from 'express';
import { createMedico, getMedicoMe, getAllMedicos } from '../controllers/medicoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de médicos requerem que o usuário esteja autenticado
router.use(authMiddleware);

router.post('/', createMedico);
router.get('/me', getMedicoMe);
router.get('/', getAllMedicos);

export default router;
