import { Request, Response } from "express";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { Op } from "sequelize";
import { ConfiguracionMembrersia } from "../models/ConfiguracionMembresia";
import { sequelize } from "../config/database";
import { Estudiante } from "../models/Estudiante";

export const insertarMembresiasDeMiembrosTarea = async () => {

    const normalizeToStartOfDayLocal = (date:Date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };
    console.log(normalizeToStartOfDayLocal(new Date()));
    try {
        console.log("Iniciando la tarea programada: Inserción de nuevas membresías.")

        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);

        const finDeHoy = new Date(hoy);
        finDeHoy.setUTCDate(hoy.getUTCDate() + 1);
        finDeHoy.setUTCMilliseconds(finDeHoy.getUTCMilliseconds() - 1);

        console.log(`aqui es para consulta ${finDeHoy}`);

        const estudiantesConMembresiasvencidas = await MembresiasMiembro.findAll({
            where: {
                fechavencimientosugerida: {
                    [Op.between]: [hoy, finDeHoy]
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
            const fechaInicioNueva = normalizeToStartOfDayLocal(today);

            const fechaLimite = normalizeToStartOfDayLocal(fechaInicioNueva);
            fechaLimite.setDate(fechaLimite.getDate() + configuracionMembresia.cantidaddediasparapagar);
          
            const fechaVencimiento = normalizeToStartOfDayLocal(fechaInicioNueva);
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + configuracionMembresia.frecuenciamesesrenovacion);
        
            
            const fechaInicioMembresia = normalizeToStartOfDayLocal(fechaInicioNueva);
            fechaInicioMembresia.setDate(fechaInicioMembresia.getDate() + 1);

             console.log(`fecha inicio nueva ${fechaInicioMembresia}`);

            const createMembresias = estudiantesConMembresiasvencidas.map(estudiante =>
                MembresiasMiembro.create({
                    dni: estudiante.dni,
                    descripcionmembresia: configuracionMembresia.descripcion,
                    fechainicio: fechaInicioMembresia,
                    fechalimitedepago: fechaLimite,
                    fechavencimientosugerida: fechaVencimiento,
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