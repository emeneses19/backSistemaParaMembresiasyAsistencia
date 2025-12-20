import { Router } from "express";
import { crearArea, eliminarArea, listarTodoArea } from '../controllers/areaControllers'
const router = Router();
router.get('/', listarTodoArea );
router.post('/crear', crearArea);
router.delete('/eliminar/:idarea', eliminarArea);

export default router;