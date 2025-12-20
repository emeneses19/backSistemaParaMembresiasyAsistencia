import { Request, Response } from "express";
import { Periodo } from "../models/Periodo";
import { Op } from "sequelize";

export const crearPerido = async(req: Request, res: Response)=>{
    try {
         const nuevoPeriodo = await Periodo.create(req.body);         
         return res.status(201).json(nuevoPeriodo);
    } catch (error) {
        return res.status(500).json({msg:'Ocurrio un error al crear perido', error});
    }
}

export const listarTodosLosPeridos = async(req: Request, res: Response)=>{
    try {
        const periodos = await Periodo.findAll();
        return res.json(periodos); 
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un eror al obtener el registro de periodos', error});
        
    }
}

export const buscarPeridoPorNombre = async(req: Request, res: Response)=>{
    try {
        let {stringIngresado} = req.params;
        if(stringIngresado.length>1){
            const periosdoEncontrado = await Periodo.findAll({
                where:{
                    nombreperiodo:{
                        [Op.iLike]:`%${stringIngresado}%`
                    }
                }
            });
            return res.json(periosdoEncontrado);
        }

    } catch (error) {
        
    }
}

export const eliminarPeriodo = async(req: Request, res: Response)=>{
    try {
        let {idperiodo} = req.params;
        const periodoEncontrado = await Periodo.findByPk(idperiodo);
        if(!periodoEncontrado){
            return res.status(400).json({msg:'No se encontro un periodo con codigo' + idperiodo});
        }
        await periodoEncontrado.destroy();
        return res.status(200).json({msg: 'Periodo Eliminado correctamene'});
    } catch (error) {
        return res.status(500).json({msg:'Ocurrio un error al eliminar periodo', error});
    }
}

