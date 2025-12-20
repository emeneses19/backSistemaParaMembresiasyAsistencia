import { Router } from "express";
import { buscarListaDeEstudiantes, crearSesion } from "../controllers/sesionControllers";

const router = Router();
router.post('/crear', crearSesion);
router.get('/lista/:idsesion', buscarListaDeEstudiantes);

export default router;