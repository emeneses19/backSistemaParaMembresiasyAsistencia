import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { MetodoPago } from "./MetoPago";

export interface PagoMembresiasEstudianteAtributes {
    idpagosmebresiasmiembro?: number,
    seriecorrelativopagomembresia: string,
    numerocorrelativopagomembresia: number,
    fecha: Date,
    fechahoraregistro?: Date,
    montotal: number,
    observacion?: string,
    idmetodosdepago: number,
    estado: string,
    fechaultimaactualizacion?: Date,
    usuarioregistra: string,
    usuariomodifica?: string

}
export type PagoMembresiaEstudianteCreationAttributes = Optional<
    PagoMembresiasEstudianteAtributes,
    | 'idpagosmebresiasmiembro'
    | 'fechahoraregistro'
    | 'observacion'
    | 'fechaultimaactualizacion'
    | 'estado'
    | 'usuariomodifica'
>
export class PagoMembresiasEstudiante extends Model<PagoMembresiasEstudianteAtributes> implements PagoMembresiasEstudianteAtributes {
    idpagosmebresiasmiembro!: number;
    seriecorrelativopagomembresia!: string;
    numerocorrelativopagomembresia!: number;
    fecha!: Date;
    fechahoraregistro!: Date;
    montotal!: number;
    observacion!: string;
    idmetodosdepago!: number;
    estado!: string;
    fechaultimaactualizacion!: Date;
    usuarioregistra: string = "1";

}

PagoMembresiasEstudiante.init({
    idpagosmebresiasmiembro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    seriecorrelativopagomembresia: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numerocorrelativopagomembresia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    montotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    observacion: {
        type: DataTypes.STRING(100),
    },
    idmetodosdepago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MetodoPago,
            key: 'idmetodosdepago',
        },
        onDelete: 'NO ACTION'
    },
    estado: {
        type: DataTypes.STRING(45),

    },
    usuarioregistra: {
        type: DataTypes.STRING(45),

    },
    usuariomodifica: {
        type: DataTypes.STRING(45),
    }

}, {
    sequelize,
    modelName: 'PagoMembresiaEstudiante',
    tableName: 'pagosmebresiasmiembros',
    createdAt: 'fechahoraregistro',
    updatedAt: 'fechaultimaactualizacion'
})
