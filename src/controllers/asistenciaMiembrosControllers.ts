import { Request, Response } from "express";
import { AsistenciasMiembro } from "../models/AsistenciasMiembro";
import { Sesion } from "../models/Sesion";
import { col, fn, literal, Op } from "sequelize";

export const registrarAsistenciaMiembro = async (req: Request, res: Response) => {
    try {
        const { idasistenciasmiembro } = req.params;
        const { asistio, usuario } = req.body;
        if (!idasistenciasmiembro) {
            return res.status(400).json({ msg: 'Selecione para registra asistencia' });
        }
        const registroEncontrado = await AsistenciasMiembro.findByPk(idasistenciasmiembro);
        if (!registroEncontrado) {
            return res.status(400).json({ msg: 'No se encontro el registro con el codigo' + '' + idasistenciasmiembro });

        }
        registroEncontrado.update({
            asistio: asistio,
            usuarioregistra: usuario
        })
        return res.status(200).json({
            msg: 'Asistencia registrada correctamente',
            registro: registroEncontrado
        })
    } catch (error) {
        console.log('Ocurrio un error al registra asistencia', error);
        return res.status(500).json({
            msg: 'Ocurrio un error al  llamar asietncia', error
        })

    }
}

export const listaDeAsistenciasPorRangoFechas = async (req: Request, res: Response) => {
    try {
        const { fechaInicio, fechaFin, idgruposmiembro } = req.query;
        if (!fechaFin || !fechaInicio) {
            return res.status(400).json({ msg: 'Ingrese las dos fechas para el reporte' });
        }
        const fechaInicioStr = fechaInicio as string;
        const fechaFinStr = fechaFin as string;
        const fechaInicioValida = new Date(fechaInicioStr);
        const fechaFinValida = new Date(fechaFinStr);
        // Normalizar rango solo si son válidas
        fechaInicioValida.setHours(0, 0, 0, 0);
        fechaFinValida.setHours(23, 59, 59, 999);


        if (fechaInicioValida > fechaFinValida) {
            return res.status(400).json({ msg: 'La fecha inicio no puede ser mayor a la fecha fin' });
        }

        const reporteAsistencias = await AsistenciasMiembro.findAll({
            attributes: [
                'dni',
                'nombrescompleto',
                [fn('SUM', literal('CASE WHEN asistio=TRUE THEN 1 ELSE 0 END')), 'totalAsistencias'],
                [fn('SUM', literal('CASE WHEN asistio=FALSE THEN 1 ELSE 0 END')), 'totalFaltas'],
                [fn('COUNT', col('AsistenciasMiembro.idsesion')), 'totalSesiones'],
                [literal(`ROUND(SUM(CASE WHEN asistio = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(AsistenciasMiembro.idsesion), 2)`),'porcentajeAsistencia']                

            ],
            include: [
                {
                    model: Sesion,
                    attributes: [],
                    where: {
                        fechasesion: {
                            [Op.between]: [fechaInicioValida, fechaFinValida]
                        },
                        ...(idgruposmiembro ? { idgruposmiembro } : {})
                    }
                }
            ],
            group: ['dni', 'nombrescompleto'],
            order: []
        })
        return res.json(reporteAsistencias);
    } catch (error) {
        console.log('Este es el eror al obtener la lista de asistencias ', error);
        return res.status(500).json({ msg: 'Ocurrio un error al obtener el reporte de asitencias en rengo de fechas' });

    }
}