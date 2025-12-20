import { Curso } from "../models/Curso";
import { Request, Response } from "express";
import { Periodo } from "../models/Periodo";

export const crearCursos = async(req: Request, res: Response)=>{
    try {
        const nuevoCurso = await Curso.create(req.body);
        return res.status(201).json(nuevoCurso);
    } catch (error) {
        return res.status(500).json({msg:'Ocurrio un error al crear cursos', error});
    }
}

export const listarTodosLosCursos = async(req: Request, res: Response)=>{
    try {
        const cursos = await Curso.findAll({
            include:[
                {model:Periodo}
            ]
        });
        return res.json(cursos);
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al obtener registro', error});
        
    }
}

export const actualizarCurso = async(req: Request, res: Response)=>{
    try {
        let {idcurso} = req.params;
        const cursoEncontrado = await Curso.findByPk(idcurso);
        if(!cursoEncontrado){
            return res.status(400).json({msg: 'No existe curso con ese codigo' + idcurso});
        }
        await cursoEncontrado.update(req.body);
        return res.status(200).json({msg:'El registro actualizado correctamente'});
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al actualizar el curso', error});
    }
}

export const eliminarCurso = async(req: Request, res: Response)=>{
    try {
        let {idcurso} = req.params;
        const cursoEliminar = await Curso.findByPk(idcurso);
        if (!cursoEliminar) {
            return res.status(400).json({msg:'No existe el curso con el codigo' + idcurso});
        }
        await cursoEliminar.destroy();
        return res.status(200).json({msg:'El registro eliminado correctamente'});
    } catch (error) {
        res.status(500).json({msg: 'Ocurrio un error al eliminar el registro', error});
        
    }
}
