import { Router } from "express";
import { buscarListaDeEstudiantes, crearSesion, dardeBaja, obtenerListaDeSesiones } from "../controllers/sesionControllers";

const router = Router();
router.post('/crear', crearSesion);
router.get('/lista/:idsesion', buscarListaDeEstudiantes);
router.get('/lista', obtenerListaDeSesiones);
router.patch('/darbaja/:idsesion', dardeBaja);

export default router;