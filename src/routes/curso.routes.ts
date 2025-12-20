import { Router } from "express";
import { actualizarCurso, crearCursos, eliminarCurso, listarTodosLosCursos } from '../controllers/cursoControllers'
const router = Router()

router.get('/',listarTodosLosCursos );
router.post('/crear', crearCursos);
router.put('/:idcurso', actualizarCurso);
router.delete('/:idcurso', eliminarCurso);

export default router;