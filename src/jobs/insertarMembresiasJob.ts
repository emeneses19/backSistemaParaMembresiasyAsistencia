import { Request, Response } from "express";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { Op } from "sequelize";
import { ConfiguracionMembrersia } from "../models/ConfiguracionMembresia";
import { sequelize } from "../config/database";
import { Estudiante } from "../models/Estudiante";

export const insertarMembresiasDeMiembrosTarea = async () => {

    const normalizeToStartOfDayLocal = (date: Date) => {
        const newDate = new Date(date);
        const anio = newDate.getFullYear();
        const mes = String(newDate.getMonth() + 1).padStart(2, '0');
        const dia = String(newDate.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia} 00:00:00`;
    };
    console.log(normalizeToStartOfDayLocal(new Date()));
    try {
        console.log("Iniciando la tarea programada: Inserción de nuevas membresías.")

        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');

        const inicioHoyStr = `${anio}-${mes}-${dia} 00:00:00`;
        const finHoyStr = `${anio}-${mes}-${dia} 23:59:59`;
        console.log(`Buscando membresías que venzan entre: ${inicioHoyStr} y ${finHoyStr}`);


        const estudiantesConMembresiasvencidas = await MembresiasMiembro.findAll({
            where: {
                fechavencimientosugerida: {
                    [Op.between]: [inicioHoyStr, finHoyStr]
                }
            },
            include: [
                {
                    model: Estudiante,
                    where: {
                        estado: {
                            [Op.ne]: 'Inactivo'
                        }
                    }
                }
            ]
        });
        if (!estudiantesConMembresiasvencidas || estudiantesConMembresiasvencidas.length === 0) {
            console.error('No hay miembros con membresías que venzan hoy para registrar nuevas.');
            return;
        }
        const configuracionMembresia = await ConfiguracionMembrersia.findOne({
            where: { activo: true }
        })
        if (!configuracionMembresia) {
            console.log('No hay datos de membresias por favor configure');
            return;
        }
        const t = await sequelize.transaction();
        try {

            const today = new Date();
            const fechaInicioNueva = new Date(today);
            fechaInicioNueva.setDate(fechaInicioNueva.getDate() + 1);

            const fechaLimite = new Date(fechaInicioNueva);
            fechaLimite.setDate(fechaLimite.getDate() + configuracionMembresia.cantidaddediasparapagar);

            const fechaVencimiento = new Date(fechaInicioNueva);
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + configuracionMembresia.frecuenciamesesrenovacion);
            const fechaInicioStr = normalizeToStartOfDayLocal(fechaInicioNueva);
            const fechaLimiteStr = normalizeToStartOfDayLocal(fechaLimite);
            const fechaVencimientoStr = normalizeToStartOfDayLocal(fechaVencimiento);

            console.log(`fecha inicio nueva ${fechaInicioStr}`);

            const createMembresias = estudiantesConMembresiasvencidas.map(estudiante =>
                MembresiasMiembro.create({
                    dni: estudiante.dni,
                    descripcionmembresia: configuracionMembresia.descripcion,
                    fechainicio: fechaInicioStr,
                    fechalimitedepago: fechaLimiteStr,
                    fechavencimientosugerida: fechaVencimientoStr,
                    montoesperado: configuracionMembresia.montoparamembresia,
                    montopagado: 0,
                    idconfiguracionmembresia: configuracionMembresia.idconfiguracionmembresia
                }, {
                    transaction: t
                })
            )
            await Promise.all([...createMembresias,]);
            await t.commit();
            console.log('Membresías creadas correctamente.');
            console.log(`membresias creadas ${createMembresias}`);


        } catch (error) {
            await t.rollback();
            console.error('Error durante la transacción:', error);
        }


    } catch (error) {
        console.error('Ocurrio un error al ejecutar la tarea', error);
    }
}