import { Response, Request } from "express";

import { GrupoMiembro } from "../models/GrupoMiembro";
import { json } from "sequelize";


export const crearGrupoMiembro = async(req: Request, res: Response)=>{
    try {
        const nuevogrupo = await GrupoMiembro.create(req.body);
        return res.status(2010).json(nuevogrupo); 
    } catch (error) {
        res.status(500),json({msg: 'Ocurrio un error al crear grupoo para miembros', error})
        
    }

}

export const listarGrupoMiembros = async(req: Request, res: Response)=>{
    try {
        const grupos = await GrupoMiembro.findAll();
        res.status(200).json(grupos);
    } catch (error) {
        res.status(500).json({msg:'Ocurio un eror al listar grupos', error});
        
    }
}

export const eliminarGrupoMiembro = async(req: Request, res: Response)=>{
    try {
        let {idgruposmiembro} = req.params;
        const grupoEncontrado = await GrupoMiembro.findByPk(idgruposmiembro);
        if (!grupoEncontrado) {
            return res.status(400).json({msg:'No se encontro el registro con el codigo ingresado' + idgruposmiembro});
        }
        await grupoEncontrado.destroy();
        res.status(200).json({msg: 'Se elimino correctamente el registro'});
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al eliminar el registro', error});
        
    }
}