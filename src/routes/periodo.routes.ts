import { Router } from "express";
import {buscarPeridoPorNombre, crearPerido, eliminarPeriodo, listarTodosLosPeridos, } from '../controllers/periodoControllers'

const router = Router();
router.post('/crear', crearPerido);
router.get('/', listarTodosLosPeridos);
router.delete('/periodo/:idperiodo', eliminarPeriodo);
router.get('/buscarperiodo/:stringIngresado', buscarPeridoPorNombre)

export default router;