import { Request, Response } from "express";
import { PagoCurso } from "../models/PagoCurso";
import { Op } from "sequelize";
import { MetodoPago } from "../models/MetoPago";
import { Inscripcion } from "../models/Inscripcion";
import { Estudiante } from "../models/Estudiante";
import { Curso } from "../models/Curso";
import { Periodo } from "../models/Periodo";

export const registrarPagoCurso = async (req: Request, res: Response) => {
    const {
        numeroserie,
        fechapago,
        montototal,
        idmetodosdepago,
        idinscripcion
    } = req.body;
    const USUARIO_SESION_TEMP = '1';

    if (!numeroserie ||
        !fechapago ||
        !montototal ||
        !idmetodosdepago ||
        !idinscripcion
    ) {
        return res.status(400).json({ msg: 'Falta ingresar datos obligatorios' });
    }
    if (isNaN(montototal) || montototal <= 0) {
        return res.status(400).json({ msg: 'El monto total debe ser un número positivo' });
    }

    const ultimoPago = await PagoCurso.findOne({
        where: { numeroserie },
        order: [['numerocorrelativo', 'DESC']]
    });

    let numeroCorrelativo = 1;
    if (ultimoPago) {
        numeroCorrelativo = ultimoPago.numerocorrelativo + 1;
    }
    const pagoCurso = await PagoCurso.create({
        numeroserie,
        numerocorrelativo: numeroCorrelativo,
        fechapago,
        montototal,
        idmetodosdepago,
        estado: req.body.estado?.trim() === "" ? null : req.body.estado,
        usuarioregistra: USUARIO_SESION_TEMP,
        usuariomodifica: null,
        observaciones: req.body.observacion?.trim() === "" ? null : req.body.observacion,
        idinscripcion,
    });
    return res.status(201).json({
        msg: 'Se registro correctamente',
        pagoCurso
    });

}

export const anularPagoCurso = async (req: Request, res: Response) => {
    try {
        let { idPpagocurso } = req.params;
        const pagoCursoEncontrado = await PagoCurso.findByPk(idPpagocurso);
        if (!pagoCursoEncontrado) {
            return res.status(400).json({ msg: 'El pago no se encontro' });
        }
        await pagoCursoEncontrado.update({
            estado: 'Anulado'
        });
        return res.status(200).json({ msg: 'El pago anulado correctamente' });
    } catch (error) {
        return res.status(500).json({ msg: 'Ocurrio un error al anular el pago', error });

    }

}

export const listarPagoCursoPorFecha = async (req: Request, res: Response) => {
    try {
        let { fechaInicio, fechaFin } = req.query;
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ msg: 'Debes proporcionar ambas fechas para el rango.' })
        }
        const fechaInicioStr = fechaInicio as string;
        const fechaFinStr = fechaFin as string;
        const fechaInicioDate = new Date(fechaInicioStr);
        const fechaFinDate = new Date(fechaFinStr);
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime()) || fechaFinDate < fechaInicioDate) {
            return res.status(400).json({ msg: 'Fechas incorrectas. La fecha de fin debe ser igual o posterior a la de inicio.' });
        }
        const pagosdelCurso = await PagoCurso.findAll({
            where: {
                fechapago: {
                    [Op.between]: [fechaInicioDate, fechaFinDate]
                }
            },
            include: [
                { model: MetodoPago },
                {
                    model: Inscripcion,
                    include: [
                        { model: Estudiante },
                        {
                            model: Curso,
                            include: [
                                { model: Periodo }
                            ]
                        }
                    ]
                }
            ]
        })

        return res.json(pagosdelCurso);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al obtener el reporte de pagos', error })
    }
}
