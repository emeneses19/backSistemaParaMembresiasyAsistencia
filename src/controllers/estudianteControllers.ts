import { Request, Response } from "express";
import { Estudiante } from "../models/Estudiante";
import { GrupoMiembro } from "../models/GrupoMiembro";
import { Cargo } from "../models/Cargo";
import { Area } from "../models/Area";
import { Op } from "sequelize";
import { MembresiasMiembro } from "../models/MembresiasMiembro";
import { sequelize } from "../config/database";
import { ConfiguracionMembrersia } from "../models/ConfiguracionMembresia";

export const crearEstudiante = async (req: Request, res: Response) => {
    try {
        let { dni } = req.body;
        if (!dni) {
            return res.status(400).json({ msg: "Debe ingresar un DNI" });
        }
        if (dni.length != 8) {
            return res.status(400).json({ msg: 'El DNI ingresado es incorrecto no tiene 8 cifras' });
        }
        const existe = await Estudiante.findByPk(dni);
        if (existe) {
            return res.status(400).json({ msg: "El estudiante con ese DNI ya existe" });
        }

        const nuevoEstudiante = await Estudiante.create(req.body);
        return res.status(201).json(nuevoEstudiante)
    } catch (error) {
        return res.status(500).json({ msg: 'Ocurrio un error al crear el estudiante', error })

    }
}

export const buscarPorDNI = async (req: Request, res: Response) => {
    try {
        let { dni } = req.params;
        if (!dni) {
            return res.status(400).json({ msg: 'Debe ingresar un DNI' })
        }
        const estudianteEncontrado = await Estudiante.findByPk(dni);
        if (!estudianteEncontrado) {
            return res.status(404).json({ msg: 'El DNI ingresado no existe en los registros ' + dni });
        }
        return res.json(estudianteEncontrado);
    } catch (error) {
        res.status(500).json({ msg: 'ocurrio un error al buscar estudiante' });
    }
}

export const actualizarEstudiante = async (req: Request, res: Response) => {
    try {
        let { dni } = req.params;
        const estudianteActualizar = await Estudiante.findByPk(dni);
        if (!estudianteActualizar) {
            return res.status(404).json({ msg: 'No existe el estudiante con DNI: ' + dni });
        }
        await estudianteActualizar.update(req.body);
        return res.status(200).json(
            { msg: 'Se actualizo la informacion correctamente',
              estudianteActualizado:req.body
             }
        );
    } catch (error) {
        return res.status(500).json({ msg: 'Ocurrio un error al actualizar la data', error });

    }
}

export const listarTodosEstudiantes = async (req: Request, res: Response) => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [
                {
                    model: GrupoMiembro,
                    required: false,
                    as: 'GrupoDeMiembro'
                },
                {
                    model: Cargo,
                    required: false,
                    as: 'Cargo'
                },
                {
                    model: Area,
                    required: false,
                    as: 'Area'
                }
            ]
        });
        return res.status(200).json(estudiantes);
    } catch (error) {
        console.log('esto es el error' + error);
        return res.status(500).json({ msg: 'Ocurrio un error al btener data de todos los estudiantes', error });
    }

}

export const listarSoloMiembros = async (req: Request, res: Response) => {
    try {
        const miembrosEncontrados = await Estudiante.findAll({
            where: {
                esmiembro: {
                    [Op.eq]: true
                },

            },
            include: [
                {
                    model: GrupoMiembro
                },
                {
                    model: Cargo
                },
                {
                    model: Area
                }
            ]


        });
        return res.json(miembrosEncontrados);
    } catch (error) {
        res.status(500).json({ msg: 'ocurrio un error al obtener solo miembros', error });
    }
}
export const listarNoMiembros = async (req: Request, res: Response) => {
    try {
        const noMiembros = await Estudiante.findAll({
            where: {
                esmiembro: false
            },
            include: [
                {
                    model: GrupoMiembro
                },
                {
                    model: Cargo
                },
                {
                    model: Area
                }
            ]
        });
        return res.status(200).json(noMiembros);
    } catch (error) {
        res.status(500).json({ msg: 'Ocurrio un error al obtner la lista', error });
    }
}

export const eliminarEstudiante = async (req: Request, res: Response) => {
    try {
        let { dni } = req.params;
        const estudiante = await Estudiante.findByPk(dni);
        if (!estudiante) {
            return res.status(404).json({ msg: `El estudiante con el DNI ${dni} no se encontro` });
        }
        await estudiante.destroy();
        return res.status(200).json({ msg: `El estudiante con el DNI ${dni} se elimino correctamente` })
    } catch (error) {
        res.status(500).json({ msg: `Ocurrio un error al eliminar el dato`, error });

    }
}

export const pasarAMiembroEstudiantes = async (req: Request, res: Response) => {
    try {
        const { estudiantes, idgruposmiembro, fechaasignacionmiembro } = req.body;
        if (!Array.isArray(estudiantes) ||
            estudiantes.length === 0 ||
            !idgruposmiembro ||
            !fechaasignacionmiembro
        ) {
            return res.status(400).json({ msg: 'Falta ingresar datos obligatorios' });
        }
        const fechaBase = new Date(fechaasignacionmiembro);
        //buscando la configuracion de membresia con estado activo 


        const configuracionMembresia = await ConfiguracionMembrersia.findOne({
            where:{
                activo:true
            }
        });
        if(!configuracionMembresia){
            return res.status(400).json({msg: 'Configurre corectamente los datos de membresia'})
        }

        //iniciando la transacion
        const t = await sequelize.transaction();
        try {
            const updates = estudiantes.map(estudiante =>
                Estudiante.update({
                    esmiembro: true,
                    fechaasignacionmiembro: fechaBase,
                    idgruposmiembro: idgruposmiembro
                }, {
                    where: {
                        dni: estudiante.dni
                    },
                    transaction:t
                }),
            );
            //esto seria para insertar el primer membresia

            
          // Calcular las fechas del pago
            const fechaLimite = new Date(fechaBase);
            fechaLimite.setDate(fechaBase.getDate() + configuracionMembresia.cantidaddediasparapagar);

            const fechaVencimiento = new Date(fechaBase);
            fechaVencimiento.setMonth(fechaBase.getMonth() + configuracionMembresia.frecuenciamesesrenovacion);

            const createPromisse = estudiantes.map(estudiante =>
                MembresiasMiembro.create({
                    dni: estudiante.dni,
                    descripcionmembresia: configuracionMembresia.descripcion,
                    fechainicio:fechaBase,
                    fechalimitedepago:fechaLimite,
                    fechavencimientosugerida:fechaVencimiento,
                    montoesperado: configuracionMembresia.montoparamembresia,
                    montopagado:0,
                    idconfiguracionmembresia:configuracionMembresia.idconfiguracionmembresia

                },{
                    transaction:t
                })
            )

            await Promise.all([...updates, ...createPromisse]);
            await t.commit();
            return res.status(200).json({ msg: 'Estudiantes asignados a miembro correctamente' });

        } catch (error) {
            await t.rollback();
            throw error;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al asignar a miembros los estudiantes' })

    }
}
