import { Router } from "express";
import { listaDeAsistenciasPorRangoFechas, registrarAsistenciaMiembro } from "../controllers/asistenciaMiembrosControllers";
const router = Router();
router.get('/lista', listaDeAsistenciasPorRangoFechas);
router.patch('/registrar/:idasistenciasmiembro', registrarAsistenciaMiembro);

export default router;