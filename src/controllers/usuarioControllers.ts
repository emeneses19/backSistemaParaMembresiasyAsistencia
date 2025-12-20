import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";

export const crearUsuario = async(req:Request, res:Response)=>{
    try {
        const {codigousuario} = req.body;
        const usuarioEncontrado = await Usuario.findByPk(codigousuario);
        if(usuarioEncontrado){
            return res.status(400).json({
                msg:'Un usuario ya existe con ese codigo'
            })
        }
        const nuevoUsuario = await Usuario.create(req.body);
        return res.status(201).json({
            msg:'Usuario  creado correctamente',
            nuevoUsuario
        })
    } catch (error) {
        console.log('El error ', error);
        return res.status(500).json({msg:'Ocurrio un error al guardar usuario', error})
        
    }
}