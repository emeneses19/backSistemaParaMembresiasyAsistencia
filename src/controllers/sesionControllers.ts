import { Request, Response } from "express";
import { Sesion } from "../models/Sesion";
import { sequelize } from "../config/database";
import { Estudiante } from "../models/Estudiante";
import { Op, QueryTypes } from "sequelize";
import { AsistenciasMiembro } from "../models/AsistenciasMiembro";


export const crearSesion = async (req: Request, res: Response) => {

    const t = await sequelize.transaction();
    try {
        

        const nuevaSesion = await Sesion.create(req.body, { transaction: t });
        if (!nuevaSesion.idgruposmiembro) {
            await t.rollback();
            return res.status(400).json({ msg: 'la sesion no fue creado corrretamente' });
        }
        const estudiantesPorGrugoMiembro = await Estudiante.findAll({
            where: {
                idgruposmiembro: nuevaSesion.idgruposmiembro,
                estado: {
                    [Op.ne]: 'Inactivo'
                }
            },
            attributes: [
                'dni',
                'nombres',
                'apellidos'
            ]
        });

        if (estudiantesPorGrugoMiembro.length === 0) {
            await t.rollback();
            return res.status(400).json({ msg: 'No se encontro estudiantes en este grupo y por eso no puedes crear sesion' });

        }

        const nuevaAsistencias = estudiantesPorGrugoMiembro.map(estudiante => ({
            dni: estudiante.dni,
            nombrescompleto: `${estudiante.nombres} ${estudiante.apellidos}`,
            asistio: false,
            usuarioregistra: '',
            idsesion: nuevaSesion.idsesion

        }));
        await AsistenciasMiembro.bulkCreate(nuevaAsistencias, { transaction: t });
        await t.commit();
        res.status(200).json({
            msg: 'Se creo la sesion con las asistencias correctamente',
            sesion: nuevaSesion
        })

    } catch (error) {
        await t.rollback();
        console.error('Error al crear la sesión con asistencias:', error);
        return res.status(500).json({ msg: 'Ocurrio un error al crear la sesion con asistencias' });
    }
}

export const buscarListaDeEstudiantes = async (req: Request, res: Response) => {
    try {
        let { idsesion } = req.params;
        const lista = await AsistenciasMiembro.findAll({
            where: { idsesion: idsesion }
        })
        return res.status(200).json(lista);
    } catch (error) {
        console.log('Ocurrio un error al buscar la lista');
        return res.status(500).json({ msg: 'Ocurio un eror al buscar la lista', error })
    }
}

export const obtenerListaDeSesiones = async (req: Request, res: Response) => {
    try {
        let { fechaInicio, fechaFin } = req.query;
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ msg: 'Ingrese las dos fechas validas' })
        }
        const fechavalidaInicio = (fechaInicio as string);
        const fechaValidaFin = (fechaFin as string);


        if (fechavalidaInicio > fechaValidaFin) {
            return res.status(400).json({ msg: 'el rango de fechas selecionadas en incorrecta' })
        }
        const sesiones = await sequelize.query(
            `
            SELECT 
            s.idsesion AS codigoSesion, 
            s.nombre AS sesionNombre,
            s.descripcion AS sesionDescripcion,
            s.fechasesion,
            s.habilitado,
            s.idgruposmiembro  AS sesionCodigoGrupo,
            s.fechahoraregistrosesion,
            g.idgruposmiembro AS codigoGrupo,
            g.nombredelgrupo,
            g.fechacreacion AS  fechaCreacionGrupo
            FROM sesiones s
            INNER JOIN gruposmiembros g
            on s.idgruposmiembro = g.idgruposmiembro
            WHERE DATE(s.fechasesion)  BETWEEN :fechaInicio AND :fechaFin
			ORDER BY s.fechasesion DESC;
            `,
            {
                replacements: {
                    fechaInicio: fechavalidaInicio,
                    fechaFin: fechaValidaFin
                },
                type: QueryTypes.SELECT
            }

        )
        return res.status(200).json(sesiones);



    } catch (error) {
        console.log('Ocurrio un error al obtener la lista de sesiones');
        return res.status(500).json({ msg: 'Ocurio un eror al buscar la lista', error });
    }
}

export const dardeBaja = async (req: Request, res: Response) => {
    try {
        let { idsesion } = req.params;
        const sesionEncontrada = await Sesion.findByPk(idsesion);
        if (!sesionEncontrada) {
            return res.status(400).json({ msg: 'No se encontro la isncripcion' });

        }
        sesionEncontrada.update({ habilitado: false });
        return res.status(200).json({ msg: `Sesion dado de baja` });
    } catch (error) {
        return res.status(500).json({ msg: `Ocurrio un error al dar de baja sesion `, error });
    }
}