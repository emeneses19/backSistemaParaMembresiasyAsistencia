import { Request, Response } from "express";

import { Cargo } from "../models/Cargo";

export const crearCargo = async(req: Request, res: Response)=>{
    try {
        const nuevoCargo = await Cargo.create(req.body);
        return res.status(201).json(nuevoCargo);
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al crear cargo', error});
    }
}
export const listarCagos = async(req:Request, res: Response)=>{
    try {
        const cargos = await Cargo.findAll();
        return res.json(cargos);
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al listar obtenerr lista de cargos', error});
    }
}
export const eliminarCargo = async(req: Request, res: Response)=>{
    try {
        let {idcargo} = req.params;
        const cargoObteneido = await Cargo.findByPk(idcargo);
        if(!cargoObteneido){
            res.status(400).json({msg:'No se encontro el cargo con el codigo', idcargo});
        }
        await cargoObteneido?.destroy();
        return res.status(200).json({msg: 'Se elimino correctamente la informacion'});
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al actualizar la informacion'});
        
    }
}