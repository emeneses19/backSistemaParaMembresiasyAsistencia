import { Request, Response } from "express";
import { DetallePagoMembresia } from "../models/DetallePagoMembresia";
import { Op } from "sequelize";
import { PagoMembresiasEstudiante } from "../models/PagoMembresiaMiembro";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { Estudiante } from "../models/Estudiante";

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
        const detalleDePagoMembresias = await DetallePagoMembresia.findAll({
            include:[
                {model:PagoMembresiasEstudiante,
                    where:{
                        fecha:{
                            [Op.between]:[fechaValidaInicio,fechaValidaFin]
                        }
                    },
                    attributes:[
                        'idpagosmebresiasmiembro',
                        'seriecorrelativopagomembresia',
                        'numerocorrelativopagomembresia',
                        'fecha',
                        'montotal',
                        'estado',                        
                    ]
                },
                {
                    model:MembresiasMiembro,
                    as:'Membresia',
                    attributes:[
                        'idmembresia',
                        ['dni', 'dni_membresia'],
                        'descripcionmembresia',


                    ],
                    include:[
                        {
                            model:Estudiante,
                            attributes:[
                                ['dni', 'dni_estudiante'],
                                'nombres',
                                'apellidos'
                            ]
                        }
                    ]

                }
                
            ]
        });
        return res.status(200).json(detalleDePagoMembresias);
    } catch (error) {
        console.log('error al buscar el reporte', error);
        res.status(500).json({msg:'Ocurrio un error al obtener el registro de detalle de venta',error})
        
    }
}