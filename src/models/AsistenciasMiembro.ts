import { DataTypes, Model, Optional } from "sequelize";
import { Sesion } from "./Sesion";
import { sequelize } from "../config/database";

export interface AsistenciasMiembroAttributes{
    idasistenciasmiembro?: number,
    fechayhoraderegistro?:Date,
    dni:string,
    nombrescompleto:string,
    asistio:boolean,
    fechaultimaactualizacion?:Date,
    usuarioregistra:string,
    idsesion:number
}

export type AsistenciasMiembroCreatAttributes = Optional<
AsistenciasMiembroAttributes,
| 'idasistenciasmiembro'
| 'fechayhoraderegistro'
| 'fechaultimaactualizacion'>


export class AsistenciasMiembro extends Model<AsistenciasMiembroAttributes> implements AsistenciasMiembroAttributes{
    idasistenciasmiembro?: number;
    fechayhoraderegistro?: Date;
    dni!: string;
    nombrescompleto!: string;
    asistio!: boolean;
    fechaultimaactualizacion?: Date;
    usuarioregistra!: string;
    idsesion!: number;
}

AsistenciasMiembro.init({
    idasistenciasmiembro:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    dni:{
        type:DataTypes.STRING(8),
        allowNull:false
    },
    nombrescompleto:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    asistio:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    usuarioregistra:{
        type:DataTypes.STRING(45),
        allowNull:false
    },
    idsesion:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Sesion,
            key:'idsesion'
        }
    }
},{
    sequelize,
    modelName:'AsistenciasMiembro',
    tableName:'asistenciasmiembros',
    createdAt:'fechayhoraderegistro',
    updatedAt:'fechaultimaactualizacion'
})