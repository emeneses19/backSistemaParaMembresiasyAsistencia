import { Router } from "express";
import { crearMetodoPago, listarMetodosDePago, eliminarMetodosDePago } from "../controllers/metodoPagoControllers";
const router = Router();

router.get('/',listarMetodosDePago );
router.post('/crear', crearMetodoPago);
router.delete('/eliminar/:idmetodosdepago', eliminarMetodosDePago);

export default router;