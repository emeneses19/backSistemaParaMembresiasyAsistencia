import { Router } from "express";
import { reporteDetalleDePagosMembresiaPorFecha } from "../controllers/detalleDePagoMembresias";
const router = Router();
router.get('/', reporteDetalleDePagosMembresiaPorFecha);

export default router;
