import { Router } from "express";
import { obtenerListaDeMembresiasPorEstudiante } from "../controllers/membresiasMiembroControllers";


const router = Router();
router.get('/todo/:dni', obtenerListaDeMembresiasPorEstudiante)


export default router;