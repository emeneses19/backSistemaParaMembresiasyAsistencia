import { Response, Request } from "express";
import { MetodoPago } from "../models/MetoPago";

export const crearMetodoPago = async(req: Request, res: Response)=>{
    try {
        const nuevo = await MetodoPago.create(req.body);
        return res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al crear',error})
        
    }
}
export const listarMetodosDePago = async(req: Request, res: Response)=>{
    try {
        const metodosPago = await MetodoPago.findAll();
        return res.status(200).json(metodosPago);
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al obtener el reporte', error});
        
    }
}
export const eliminarMetodosDePago = async(req: Request, res:Response)=>{
    try {
        let {idmetodosdepago} = req.params;
        const metodoDePagoEncontrado = await MetodoPago.findByPk(idmetodosdepago);
        if(!metodoDePagoEncontrado){
            return res.status(400).json({msg: `'No se encontro el registro con codigo ${idmetodosdepago}`});

        }
        await metodoDePagoEncontrado.destroy();
        return res.status(200).json({msg: 'Registro eliminado con exito'});
    } catch (error) {
        return res.status(500).json({msg: 'Ocurrio un error al eliminar el registro'});
        
    }
}