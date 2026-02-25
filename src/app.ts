import express from 'express';
import cors from 'cors';
import './models/asociaciones';
import periodoRoutes from './routes/periodo.routes';
import cursoRoutes from './routes/curso.routes';
import areaRoutes from './routes/area.routes';
import cargoRoutes from './routes/cargo.Routes';
import configuracionMembresiaRoutes from './routes/configuracionMembresia.routes'
import grupoMiembroRoutes from './routes/grupoMiembro.Routes';
import estudianteRoutes from './routes/estudiante.routes';
import metodoDePagoRoutes from './routes/metoPago.Routes';
import inscripcionPagoRoutes from './routes/inscripcion.Routes';
import pagoCursoRoutes from './routes/pagoCurso.routes';
import reportePagoCursoRoutes from './routes/reportePagoCursos.Routes';
import reporteMembreriasRoutes from './routes/membresiaMiembro.routes';
import reportePagoMembreriasRoutes from './routes/pagoMembresia.routes';
import reporteDetallePagoMembreriasRoutes from './routes/detalleDePagoMembresias.routes';
import sesionRoutes from './routes/sesion.routes';
import asistenciaMiembrosRoutes from './routes/asitenciaMiembro.routes';


const app = express();

//middlewares

app.use(cors());
app.use(express.json());

//Rutas
// app.get('/', (req, res) =>{
//     res.send("Backend funcionando");

// });
app.use('/periodos',periodoRoutes );
app.use('/cursos', cursoRoutes);
app.use('/areas', areaRoutes);
app.use('/cargos', cargoRoutes);
app.use('/configuracionmembresia', configuracionMembresiaRoutes);
app.use('/grupomiembros', grupoMiembroRoutes);
app.use('/estudiantes', estudianteRoutes);
app.use('/metodospago', metodoDePagoRoutes);
app.use('/inscripciones', inscripcionPagoRoutes);
app.use('/pago-cursos', pagoCursoRoutes);
app.use('/estudiante-cursos', reportePagoCursoRoutes);
app.use('/membresias', reporteMembreriasRoutes);
app.use('/pagomembresias', reportePagoMembreriasRoutes);
app.use('/detallepagomembresias', reporteDetallePagoMembreriasRoutes);
app.use('/sesiones', sesionRoutes);
app.use('/asistencias', asistenciaMiembrosRoutes);



export default app;
