import { Router } from "express";
import { 
    actualizarEstudiante, 
    buscarPorDNI, 
    crearEstudiante, 
    eliminarEstudiante, 
    listarSoloMiembros, 
    listarTodosEstudiantes, 
    listarNoMiembros,
    pasarAMiembroEstudiantes
 } from '../controllers/estudianteControllers';

const router = Router();

router.get('/todos', listarTodosEstudiantes);
router.get('/miembros', listarSoloMiembros);
router.get('/no-miembros', listarNoMiembros);
router.get('/:dni', buscarPorDNI);
router.post('/crear', crearEstudiante);
router.delete('/eliminar/:dni', eliminarEstudiante);
router.put('/actualizar/:dni', actualizarEstudiante);
router.patch('/asignar-miembro/',pasarAMiembroEstudiantes );

export default router;