import { Request, Response } from "express";
import { ConfiguracionMembrersia } from "../models/ConfiguracionMembresia";

export const crearConfiguracionMembresia = async(req: Request, res: Response)=>{
    try {
        const {
            descripcion,
            montoparamembresia, 
            frecuenciamesesrenovacion, 
            cantidaddediasparapagar, 
            activo
        } = req.body;
        if(
            !descripcion || 
            !montoparamembresia || 
            !frecuenciamesesrenovacion || 
            !cantidaddediasparapagar || 
            !activo ){
                return res.status(400).json({msg: 'Inggrese los datos correctos'})
            }            

        const nuevoConfiguracionMembresia = await ConfiguracionMembrersia.create(req.body);
        return res.status(201).json(nuevoConfiguracionMembresia);
    } catch (error) {
        return res.status(500).json({msg: 'Ocurrio un error al guardar la configuracion de membresias', error});
    }
}

export const actualizarConfiguracionMembresia = async(req: Request, res: Response)=>{
    try {
        const {
            descripcion,
            montoparamembresia, 
            frecuenciamesesrenovacion, 
            cantidaddediasparapagar, 
            activo
        } = req.body;
        if (
      !descripcion ||
      !montoparamembresia || montoparamembresia <= 0 ||
      !frecuenciamesesrenovacion || frecuenciamesesrenovacion <= 0 ||
      !cantidaddediasparapagar || cantidaddediasparapagar <= 0 ||
      activo === undefined
    ){
                return res.status(400).json({msg:'Verifique la iformacion de los datos'});

        }
        const configuracion = await ConfiguracionMembrersia.findOne();
        if(!configuracion){
            return res.status(400).json({msg: 'No tiene uan configuracion previa para actualizar la informacion'});
        }
        await configuracion.update(req.body);
        return res.status(200).json({msg: 'Configuracion de membresia actualziada', configuracion});


    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al actualizar la configuracion', error});
        
    }

}

export const obtenerConfiguracionMembresia = async(req: Request, res: Response)=>{
    try {
        const configuraciones = await ConfiguracionMembrersia.findAll();
        return res.json(configuraciones);
    } catch (error) {
        res.status(500).json({msg:'Ocurrio un error al obtener configuracion de membresia', error});
    }
}