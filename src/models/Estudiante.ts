import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { GrupoMiembro } from "./GrupoMiembro";
import { Area } from "./Area";
import { Cargo } from "./Cargo";

export interface EstudianteAttributes {
    dni: string;
    nombres: string;
    apellidos: string;
    fechadenacimiento: Date;
    celular: string;
    correo: string;
    direccion: string;
    estado: string;
    fecharegistro?: Date;
    esmiembro: boolean;
    fechaasignacionmiembro?: Date;
    fechadeultimaactualizacion?: Date;
    idgruposmiembro?: number | null;
    idarea?: number | null;
    idcargo?: number | null;
    detalle1?: string | null;
    detalle2?: string | null;

}

//  Campos opcionales al crear

export type EstudianteCreationAttributes = Optional<
    EstudianteAttributes,
    | "fecharegistro"
    | "fechaasignacionmiembro"
    | "fechadeultimaactualizacion"
    | "idgruposmiembro"
    | "idarea"
    | "idcargo"
    | "detalle1"
    | "detalle2"
>;

export class Estudiante extends Model<EstudianteAttributes, EstudianteCreationAttributes> implements EstudianteAttributes {
    dni!: string;
    nombres!: string;
    apellidos!: string;
    fechadenacimiento!: Date;
    celular!: string;
    correo!: string;
    direccion!: string;
    estado!: string;
    fecharegistro?: Date;
    esmiembro!: boolean;
    fechaasignacionmiembro?: Date | undefined;
    fechadeultimaactualizacion?: Date | undefined;
    idgruposmiembro?: number | null;
    idarea?: number | null;
    idcargo?: number | null;
    detalle1?: string | null;
    detalle2?: string | null;
}

Estudiante.init({
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false

    },
    apellidos: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    fechadenacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    celular: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(55),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    esmiembro: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    fechaasignacionmiembro: {
        type: DataTypes.DATE
    },
    idgruposmiembro: {
        type: DataTypes.INTEGER,
        references: {
            model: GrupoMiembro,
            key: 'idgruposmiembro'
        },
        onDelete: 'NO ACTION'
    },
    idarea: {
        type: DataTypes.INTEGER,
        references: {
            model: Area,
            key: 'idarea'
        },
        onDelete: 'NO ACTION'
    },
    idcargo: {
        type: DataTypes.INTEGER,
        references: {
            model: Cargo,
            key: 'idcargo'
        },
        onDelete: 'NO ACTION'
    },
    detalle1: {
        type: DataTypes.STRING(100)
    },
    detalle2: {
        type: DataTypes.STRING(250)
    }
}, {
    sequelize,
    modelName: 'Estudiante',
    tableName: 'estudiantes',
    updatedAt: 'fechadeultimaactualizacion',
    createdAt: 'fecharegistro'
})