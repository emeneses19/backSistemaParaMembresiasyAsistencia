import { Router } from "express";
import { obtenerListaDeCursosPorEstudiante, reporteDeEstadoDePagoPorCurso } from "../controllers/reportePagosCursoControllers";
const router = Router();

router.get('/lista-cursos/:dni',obtenerListaDeCursosPorEstudiante );
router.get('/lista-estudiantes-encurso/:idcurso',reporteDeEstadoDePagoPorCurso );

export default router;