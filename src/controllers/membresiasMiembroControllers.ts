import { Request, Response } from "express";
import { sequelize } from "../config/database";
import { MembresiasMiembro } from "../models/MembresiasMiembro";

export const obtenerListaDeMembresiasPorEstudiante = async(req: Request, res: Response)=>{
    try {
        let {dni} = req.params;
        const membresias =  await MembresiasMiembro.findAll({
            where:{dni:dni}
        });
         if (!membresias || membresias.length === 0) {
            return res.status(200).json({
                membresias: [],
                deudaTotal: 0
            });
        }
        const deudaTotal = membresias.reduce((total,membresia)=>{
            const esperado = Number(membresia.montoesperado) || 0;
            const pagado = Number(membresia.montopagado) || 0;
            const deudaIndividual = Math.max(0, esperado - pagado);
            return total + deudaIndividual;
        }, 0);       

        return res.json({
            membresias:membresias,
            deudaTotal:Number(deudaTotal)
        }

        );
    } catch (error) {
        console.log('Ocurrio un error al obtener lista de membresias ', error);
        res.status(500).json({msg:'Ocurrio un error al obtener el registro ', error});
    }
}