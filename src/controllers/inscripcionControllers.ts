import { Request, Response } from "express";
import { Inscripcion } from "../models/Inscripcion";
import { Op } from "sequelize";
import { Estudiante } from "../models/Estudiante";
import { Curso } from "../models/Curso";
import { Periodo } from "../models/Periodo";

let mensajeError = 'Ocurrio un error al realizar la';

export const crearInscripcion = async (req: Request, res: Response) => {
    try {
        const { idinscripcion,fechadeinscripcion, estado, dni, idcurso } = req.body;
        if (!idinscripcion && !fechadeinscripcion && !estado && !dni && !idcurso) {
            return res.status(400).json({ msg: 'No se ingreso los datos correctamnete' });
        }
        const yaInscrito = await Inscripcion.findOne({
            where: { dni, idcurso }
        });
        if (yaInscrito) {
            return res.status(400).json({ msg: 'El estudiante ya esta inscrito en este curso!' });
        }
        const nuevoRegistro = await Inscripcion.create(req.body);
        return res.status(201).json(nuevoRegistro);
    } catch (error) {
        console.log('este es el error al inscribir', error);
        return res.status(500).json({ msg: 'Ocurrio un error al registrar inscripcion', error });
    }
}

export const dardeBaja = async (req: Request, res: Response) => {
    try {
        let { idinscripcion } = req.params;
        const inscripcionEncontrada = await Inscripcion.findByPk(idinscripcion);
        if (!inscripcionEncontrada) {
            return res.status(400).json({ msg: 'No se encontro la isncripcion' });

        }
        inscripcionEncontrada.update({ estado: 'Baja' });
        return res.status(200).json({ msg: `EStudiante dado de baja` });
    } catch (error) {
        return res.status(500).json({ msg: `${mensajeError} dar de baja`, error });
    }
}

export const reactivarEstudiante = async (req: Request, res: Response) => {
    try {
        let { idinscripcion } = req.params;
        const inscripcionEncontrada = await Inscripcion.findByPk(idinscripcion);

        if (!inscripcionEncontrada) {
            return res.status(400).json({ msg: 'No se encontro el registro' });

        }
        await inscripcionEncontrada.update({ estado: 'Activo' });
        return res.status(200).json({ msg: 'Se dio de alta al estudiante correctamente' });
    } catch (error) {
        return res.status(500).json({ msg: `${mensajeError} reactivar estudiante `, error })
    }
}

export const listarTodoInscripcionPorFecha = async (req: Request, res: Response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        if (!fechaFin || !fechaInicio) {
            return res.status(400).json({ msg: 'Debes proporcionar ambas fechas para el rango.' })
        }

        const fechaInicioStr = fechaInicio as string;
        const fechaFinStr = fechaFin as string;
        const fechaInicioDate = new Date(fechaInicioStr);
        const fechaFinDate = new Date(fechaFinStr);
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime()) || fechaFinDate < fechaInicioDate) {
            return res.status(400).json({ msg: 'Fechas incorrectas. La fecha de fin debe ser igual o posterior a la de inicio.' });
        }
        const inscripciones = await Inscripcion.findAll({
            where: {
                fechadeinscripcion: {
                    [Op.between]: [fechaInicioDate, fechaFinDate]
                }
            },
            include: [
                { model: Estudiante },
                {
                    model: Curso,
                    include: [
                        { model: Periodo }
                    ]
                }
            ]
        })
        res.status(200).json(inscripciones);

    } catch (error) {

        res.status(500).json({
            status:'error',
            msg:`${mensajeError} al obtner el reporte`,
            error:error instanceof Error ? error.message : 'Error desconocido'
        })
    }
}

export const listaDeInscripcionesPorCurso = async(req: Request, res:Response)=>{
    try {
        let {idcurso} = req.params;
        if(!idcurso){
            return res.status(400).json({msg: 'Seleccione un curso para buscar'});
        }
        const inscritosPorCurso = await Inscripcion.findAll({
            where:{
                idcurso:idcurso,
            },
            include:[
                {model:Estudiante},
                {model:Curso}
            ]
        })
        return res.status(200).json(inscritosPorCurso);
    } catch (error) {
        console.log(error, 'Este es eel error al obtenr lista de isncritos de un curso')
        res.status(500).json({msg: 'Ocurrio un error al obtenr la lsita de estudiantes inscritos', error })
        
    }
}

