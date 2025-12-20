import { Router } from "express";
import { anularPagoCurso, listarPagoCursoPorFecha, registrarPagoCurso } from "../controllers/pagoCursoControllers";
const router = Router();

router.get('/', listarPagoCursoPorFecha);
router.post('/crear', registrarPagoCurso);
router.patch('/anular/:idPpagocurso', anularPagoCurso);

export default router;