import { Request, Response } from "express";
import { PagoMembresiasEstudiante } from '../models/PagoMembresiaMiembro'
import { sequelize } from "../config/database";
import { DetallePagoMembresia } from "../models/DetallePagoMembresia";
import { Op } from "sequelize";
import { MetodoPago } from "../models/MetoPago";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { Estudiante } from "../models/Estudiante";

export const registrarPagoMembresias = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {

        let {
            seriecorrelativopagomembresia,
            fecha,
            montotal,
            idmetodosdepago,
            detallesMembresias
        } = req.body;
        if (
            !seriecorrelativopagomembresia ||
            !fecha ||
            !montotal ||
            !Number(montotal) ||
            !idmetodosdepago ||
            !Array.isArray(detallesMembresias) ||
            detallesMembresias.length === 0

        ) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios, verifique por favor' });
        }

        const ultimoPago = await PagoMembresiasEstudiante.findOne({
            where: { seriecorrelativopagomembresia },
            order: [['numerocorrelativopagomembresia', 'DESC']],
            transaction:t
        })
        let nuevoCorrelativo = 1;
        if (ultimoPago) {
            nuevoCorrelativo = ultimoPago.numerocorrelativopagomembresia + 1;
        }
        //insertr pago y detalle
        const pagoNuevoMembresia = await PagoMembresiasEstudiante.create({
            seriecorrelativopagomembresia: seriecorrelativopagomembresia,
            numerocorrelativopagomembresia: nuevoCorrelativo,
            fecha: fecha,
            montotal: montotal,
            observacion: req.body.observacion?.trim() === "" ? null : req.body.observacion,
            idmetodosdepago: idmetodosdepago,
            estado: 'Activo'

        }, {
            transaction: t
        });

        const detalleConIdPago = detallesMembresias.map(detalle => ({
            ...detalle,
            idpagosmebresiasmiembro: pagoNuevoMembresia.idpagosmebresiasmiembro
        }))

        await DetallePagoMembresia.bulkCreate(detalleConIdPago, { transaction: t });

        //actualizar el monto pagado para el estudiante
        for (const detalle of detallesMembresias) {
           await MembresiasMiembro.update(
                {
                    montopagado: sequelize.literal(`montopagado + ${Number(detalle.montomembresia)}`),
                },
                {
                    where: {
                        idmembresia: detalle.idmembresia
                    },
                    transaction: t
                
                }
            )
        }


        await t.commit();
        return res.status(201).json({
            msg: 'Se registro el pago correctamente',
            pago: pagoNuevoMembresia
        })

    } catch (error) {
        await t.rollback();
        console.log('error al registra pago', error);
        return res.status(500).json({ msg: 'Ocurrio un error al registrar pago', error })

    }
}

export const reporteDePagosMembresiPorFecha = async (req: Request, res: Response) => {
    try {
        let { fechaInicio, fechaFin } = req.query;
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ msg: 'Ingrese las dos fechas validas' })
        }
        const fechavalidaInicio = new Date(fechaInicio as string);
        const fechaValidaFin = new Date(fechaFin as string);
        if (fechavalidaInicio > fechaValidaFin) {
            return res.status(400).json({ msg: 'el rango de fechas selecionadas en incorrecta' })
        }
        const pagosMembresias = await PagoMembresiasEstudiante.findAll({
            where: {
                fecha: {
                    [Op.between]: [fechavalidaInicio, fechaValidaFin]
                }
            },
            include: [
                {
                    model: MetodoPago,
                    attributes: ['nombre']

                },
            ]
        })
        return res.status(200).json(pagosMembresias);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Ocurrio un error al obtener el reporte' })
    }
}


export const previsualizarPago = async (req: Request, res: Response) => {
    try {
        let { idpagosmebresiasmiembro } = req.params;
        const pagoMembresiaEncontrado = await PagoMembresiasEstudiante.findByPk(idpagosmebresiasmiembro,
            {include:[
                {
                    model: MetodoPago,
                    attributes: ['nombre']

                },
                
                { model: MembresiasMiembro,
                    attributes: ['dni','descripcionmembresia','fechainicio','fechavencimientosugerida','montoesperado','montopagado' ],
                    include:[
                        {model:Estudiante,
                            attributes:['dni', 'nombres', 'apellidos', 'celular', 'correo',]
                        }
                    ]
                 }

        ]}
    )
        return res.status(200).json(pagoMembresiaEncontrado)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al realizar la accion ', error });
    }
}

export const anularPagoMembresia = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        let { idpagosmebresiasmiembro } = req.params;
        const pagoEncontrado: any = await PagoMembresiasEstudiante.findByPk(
            idpagosmebresiasmiembro,
            {
                include: [{
                    model: MembresiasMiembro,
                    through: { attributes: ['iddetalledepago', 'montomembresia'] }
                }],
                transaction: t
            }
        );
        if (!pagoEncontrado) {
            await t.rollback();
            return res.status(400).json({ msg: `No se encontro el registro con el codigo seleccionado ${idpagosmebresiasmiembro}` });
        }
        if (pagoEncontrado.estado === 'Anulado') {
            await t.rollback();
            return res.status(400).json({ msg: 'El pago ya se encuentra anulado.' });
        }

        if (pagoEncontrado.MiembrosMembresia && pagoEncontrado.MiembrosMembresia.length > 0) {
            for (const detalle of pagoEncontrado.MiembrosMembresia) {
                const monto = detalle.DetallePagoMembresia.montomembresia;

                await MembresiasMiembro.update(
                    {
                        montopagado: sequelize.literal(`GREATEST(montopagado - ${monto}, 0)`)
                    },
                    {
                        where: { idmembresia: detalle.idmembresia },
                        transaction: t,
                    }
                );
            }
        }

        await pagoEncontrado.update(
            { estado: 'Anulado' },
            { transaction: t }

        );
        await t.commit();
        return res.status(200).json({ msg: 'Se anulo el pago correctamnete' });

    } catch (error) {
        await t.rollback();
        console.log('Ocurrio un problema al anular el pago', error);
        return res.status(500).json({ msg: 'Ocurrio un error al procesar el comando ', error })
    }
}