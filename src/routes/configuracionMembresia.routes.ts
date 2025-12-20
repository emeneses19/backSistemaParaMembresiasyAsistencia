import { Router } from "express";
import { crearConfiguracionMembresia, obtenerConfiguracionMembresia, actualizarConfiguracionMembresia } from "../controllers/configuracionMembresiControllers";

const router = Router()

router.get('/', obtenerConfiguracionMembresia);
router.post('/crear',crearConfiguracionMembresia);
router.put('/actualizar', actualizarConfiguracionMembresia);
export default router;