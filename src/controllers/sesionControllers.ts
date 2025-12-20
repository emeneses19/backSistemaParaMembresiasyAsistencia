import { Request, Response } from "express";
import { Sesion } from "../models/Sesion";
import { sequelize } from "../config/database";
import { Estudiante } from "../models/Estudiante";
import { Op } from "sequelize";
import { AsistenciasMiembro } from "../models/AsistenciasMiembro";

export const crearSesion = async(req: Request, res: Response)=>{

    const t = await sequelize.transaction();
    try {
        const nuevaSesion = await Sesion.create(req.body,{transaction:t});
        if(!nuevaSesion.idgruposmiembro){
            await t.rollback();
            return res.status(400).json({msg:'la sesion no fue creado corrretamente'});
        }
        const estudiantesPorGrugoMiembro = await Estudiante.findAll({
            where:{
                idgruposmiembro:nuevaSesion.idgruposmiembro,
                estado:{
                    [Op.ne]:'Inactivo'
                }
            },
            attributes:[
                'dni',
                'nombres',
                'apellidos'
            ]
        });

        if(estudiantesPorGrugoMiembro.length===0){
            await t.rollback();
            return res.status(400).json({msg:'No se encontro estudiantes en este grupo y por eso no puedes crear sesion'});
        
        }

        const nuevaAsistencias = estudiantesPorGrugoMiembro.map(estudiante=>({
            dni: estudiante.dni,
            nombrescompleto: `${estudiante.nombres} ${estudiante.apellidos}`,
            asistio:false,
            usuarioregistra:'',
            idsesion:nuevaSesion.idsesion

        }));
        await AsistenciasMiembro.bulkCreate(nuevaAsistencias, { transaction: t });
        await t.commit();
        res.status(200).json({msg:'Se creo la sesion con las asistencias correctamente',
            sesion: nuevaSesion
        })

    } catch (error) {
        await t.rollback();
        console.error('Error al crear la sesión con asistencias:', error);
        return res.status(500).json({msg:'Ocurrio un error al crear la sesion con asistencias'});
    }
}

export const buscarListaDeEstudiantes = async(req: Request, res:Response)=>{
    try {
        let {idsesion} = req.params;
        const lista = await AsistenciasMiembro.findAll({
            where:{idsesion:idsesion}
        })
        return res.status(200).json(lista);
    } catch (error) {
        console.log('Ocurrio un error al buscar la lista');
        return res.status(500).json({msg:'Ocurio un eror al buscar la lista', error})
    }
}