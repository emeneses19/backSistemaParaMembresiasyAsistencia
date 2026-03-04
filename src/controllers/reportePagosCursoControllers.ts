import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/database";

export const obtenerListaDeCursosPorEstudiante = async (req: Request, res: Response) => {
    try {
        const { dni } = req.params;
        const cursos = await sequelize.query(
            `
            SELECT
            p.idperiodo AS idPeriodo,
            p.nombreperiodo AS nombrePeriodo,
            c.idcurso AS idCurso,
            c.nombre AS cursoNombre,
            c.costo AS costoCurso,
            i.idinscripcion,
            i.fechadeinscripcion,
            e.dni,
            e.nombres AS nombresEstudiante,
            e.apellidos AS apellidosEstudiante,
            e.celular,
            CASE
        WHEN (
            SELECT
                SUM(pc1.montototal)
            FROM
                pagocursos pc1
            WHERE
                pc1.idinscripcion = i.idinscripcion
            AND e.dni = i.dni
        ) >= c.costo THEN
            'Pagado'
        ELSE
            'Pendiente'
        END AS estato_Pago_Curso
        FROM
            inscripcion AS i
        INNER JOIN estudiantes e ON e.dni = i.dni
        INNER JOIN cursos c ON c.idcurso = i.idcurso
        INNER JOIN periodos p ON p.idperiodo = c.idperiodo
        WHERE
            i.dni = :dni
        ORDER BY
            i.fechadeinscripcion DESC;
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { dni }
            }
        );
        return res.json(cursos);

    } catch (error) {
        console.log(error, 'este es el error al obtener cursos');
        res.status(500).json({ msg: 'Ocurrio un error al obtener la lista de cursos', error })
    }
}

export const reporteDeEstadoDePagoPorCurso = async (req: Request, res: Response) => {
    try {
        let { idcurso } = req.params;
        const estudiantesConEStadoDePagoCurso = await sequelize.query(`
            SELECT
            e.nombres,
            e.apellidos,
            e.estado as estado_estudiante,
            i.estado as estado_inscripcion,
            i.fechadeinscripcion as fechaincripcion,
            i.dni,
            c.nombre,
            p.nombreperiodo,
            CASE
                                WHEN (SELECT SUM(pc1.montototal)
                                    FROM pagocursos pc1
                                    WHERE pc1.idinscripcion = i.idinscripcion
                                    AND e.dni = i.dni) >= c.costo THEN 'Pagado'
                                ELSE 'Pendiente'
                            END AS estato_Pago_Curso

            FROM
                estudiantes e
            INNER JOIN inscripcion i ON i.dni = e.dni
            INNER JOIN cursos c ON c.idcurso = i.idcurso
            INNER JOIN periodos p ON p.idperiodo = c.idperiodo
            LEFT JOIN pagocursos pc ON pc.idinscripcion = i.idinscripcion
            WHERE
                c.idcurso = :idcurso

            `, {
            type: QueryTypes.SELECT,
            replacements: { idcurso }
        });
        res.status(200).json(estudiantesConEStadoDePagoCurso);
    } catch (error) {
        console.log('El error es este:' + ' ' + error);
        res.status(500).json({
            msg: 'Ocurrio un error al obener el reporte ', error
        })
    }

} 