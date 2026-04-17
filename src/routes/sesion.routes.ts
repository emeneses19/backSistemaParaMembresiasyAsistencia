import { Router } from "express";
import { buscarListaDeEstudiantes, crearSesion, obtenerListaDeSesiones } from "../controllers/sesionControllers";

const router = Router();
router.post('/crear', crearSesion);
router.get('/lista/:idsesion', buscarListaDeEstudiantes);
router.get('/lista', obtenerListaDeSesiones);

export default router;