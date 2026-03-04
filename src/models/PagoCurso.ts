import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { MetodoPago } from "./MetoPago";
import { Inscripcion } from "./Inscripcion";

export interface PagoCursoAtributes {
    idPpagocurso?: number;
    numeroserie: string;
    numerocorrelativo: number;
    fechapago: Date;
    montototal: number;
    idmetodosdepago: number;
    estado: string;
    usuarioregistra: string;
    usuariomodifica?: string | null;
    fechadeultimamodificacion?: Date | undefined;
    observaciones?: string | null
    idinscripcion: string;
}

export class PagoCurso extends Model<PagoCursoAtributes> implements PagoCursoAtributes {
    idPpagocurso?: number;
    numeroserie!: string;
    numerocorrelativo!: number;
    fechapago!: Date;
    montototal!: number;
    idmetodosdepago!: number;
    estado!: string;
    usuarioregistra!: string;
    usuariomodifica?: string | null;
    fechadeultimamodificacion?: Date | undefined;
    observaciones?: string | null;
    idinscripcion!: string;

}

PagoCurso.init({
    idPpagocurso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    numeroserie: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numerocorrelativo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechapago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    montototal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    idmetodosdepago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MetodoPago,
            key: 'idmetodosdepago'
        },
        onDelete: 'NO ACTION'

    },
    estado: {
        type: DataTypes.STRING()
    },
    usuarioregistra: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    usuariomodifica: {
        type: DataTypes.STRING(45),
    },
    observaciones: {
        type: DataTypes.STRING(250),
    },
    idinscripcion: {
        type: DataTypes.STRING(45),
        allowNull: false,
        references: {
            model: Inscripcion,
            key: 'idinscripcion'
        },
        onDelete: 'NO ACTION'
    }
}, {
    sequelize,
    modelName: 'PagoCurso',
    tableName: 'pagocursos',
    updatedAt: 'fechadeultimamodificacion',
    createdAt: false,
})