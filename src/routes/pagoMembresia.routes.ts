import { Router } from "express";
import {anularPagoMembresia, previsualizarPago, registrarPagoMembresias, reporteDePagosMembresiPorFecha} from '../controllers/pagoMembresiaEstudianteControllers'
const router = Router();
router.get('/', reporteDePagosMembresiPorFecha);
router.get('/detalle/:idpagosmebresiasmiembro',previsualizarPago);
router.post('/registrar', registrarPagoMembresias);
router.patch('/anular/:idpagosmebresiasmiembro', anularPagoMembresia);
export default router;