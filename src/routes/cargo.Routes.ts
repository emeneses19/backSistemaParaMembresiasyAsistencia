import { Router } from "express";
import { crearCargo, eliminarCargo, listarCagos } from "../controllers/cargoControllers";

const router = Router();
router.get('/', listarCagos);
router.post('/crear', crearCargo);
router.delete('/eliminar/:idcargo', eliminarCargo);
export default router;