import { Request, Response } from "express";
import { DetallePagoMembresia } from "../models/DetallePagoMembresia";
import { Op, QueryTypes } from "sequelize";
import { PagoMembresiasEstudiante } from "../models/PagoMembresiaMiembro";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { Estudiante } from "../models/Estudiante";
import { sequelize } from "../config/database";

export const reporteDetalleDePagosMembresiaPorFecha = async(req:Request, res: Response)=>{
    try {
        let {fechaInicio, fechaFin}= req.query;
        if (!fechaInicio || !fechaFin) {
            res.status(400).json({msg:'Ingrese las fechas para el reporte'});
        }
        let fechaValidaInicio = new Date(fechaInicio as string);
        let fechaValidaFin = new Date(fechaFin as string);
        if(fechaValidaInicio > fechaValidaFin){
            res.status(400).json({msg:'La fecha superior no puede ser menor a la fecha inicio'});
        }
        const detalleDePagoMembresias = await sequelize.query(
            `
            SELECT 
            dp.iddetalledepago as pagoCodigo,
            dp.idmembresia as pagoCodMembresia,
            dp.idpagosmebresiasmiembro as detalleCodPago,
            dp.descripcion_membresia as pagoDescripcion, 
            dp.montomembresia,
            dp.detalleadicional,
            p.fecha,
            p.seriecorrelativopagomembresia as serie,
            p.numerocorrelativopagomembresia as numeroDoc,
            p.estado,
            p.usuarioregistra, 
            p.usuariomodifica,
            m.idmembresia as membresiaCod,
            m.dni,
            m.descripcionmembresia as membresiaDesc,
            e.dni as estudianteDNI,
            e.nombres,
            e.apellidos  
            FROM detalledepagos as dp
            inner JOIN pagosmebresiasmiembros as p
            ON dp.idpagosmebresiasmiembro = p.idpagosmebresiasmiembro
            inner join	 membresiasmiembros as m
            on dp.idmembresia = m.idmembresia 
            INNER JOIN estudiantes e
            on e.dni = m.dni
            WHERE DATE(p.fecha)  BETWEEN :fechaInicio AND :fechaFin
            ORDER BY p.fecha DESC;
            `,{
                replacements:{
                    fechaInicio: fechaValidaInicio,
                    fechaFin: fechaValidaFin
                },
                type: QueryTypes.SELECT
            });
        return res.status(200).json(detalleDePagoMembresias);
    } catch (error) {
        console.log('error al buscar el reporte', error);
        res.status(500).json({msg:'Ocurrio un error al obtener el registro de detalle de venta',error})
        
    }
}