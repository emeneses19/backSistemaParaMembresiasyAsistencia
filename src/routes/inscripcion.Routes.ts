import { Router } from "express";
import { 
    crearInscripcion, 
    dardeBaja, 
    listaDeInscripcionesPorCurso, 
    listarTodoInscripcionPorFecha, 
    reactivarEstudiante 
} from "../controllers/inscripcionControllers";
const router = Router();

router.get('/',listarTodoInscripcionPorFecha );
router.get('/lista-estudiantes/:idcurso',listaDeInscripcionesPorCurso);
router.post('/crear', crearInscripcion);
router.patch('/activar/:idinscripcion', reactivarEstudiante)
router.patch('/desactivar/:idinscripcion', dardeBaja);


export default router;