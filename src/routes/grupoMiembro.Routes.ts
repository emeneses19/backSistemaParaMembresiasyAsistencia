import { Router } from "express";
import { crearGrupoMiembro, eliminarGrupoMiembro, listarGrupoMiembros } from "../controllers/grupoMiembroControllers";
const router = Router();
router.get('/', listarGrupoMiembros);
router.post('/crear', crearGrupoMiembro);
router.delete('/eliminar/:idgruposmiembro', eliminarGrupoMiembro);

export default router;