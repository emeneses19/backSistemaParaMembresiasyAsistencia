import { Request, Response } from "express";
import {Area} from '../models/Area'
import { json } from "sequelize";
import { error } from "console";
export const crearArea = async(req: Request, res: Response)=>{
    try {
        const nuevoArea = await Area.create(req.body);
        return res.status(201).json(nuevoArea);
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al crear area', error})
        
    }
}

export   const listarTodoArea = async(req: Request, res: Response)=>{
    try {
        const areas = await Area.findAll();
        return res.json(areas);
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al obtener el registro', error})
        
    }
}

export const eliminarArea = async(req: Request, res: Response)=>{
    try {
        let {idarea} = req.params;
        const areaEncontrada = await Area.findByPk(idarea);
        if (!areaEncontrada) {
            return res.status(400).json({msg:'No se encontro area con el codigo' + idarea});
        }
        await areaEncontrada.destroy();
        return res.status(200),json({msg: 'El dato fue eliminado correctamente', error});
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al eliminar el registro', error});
    }
}