import { DataTypes, Model, Optional } from "sequelize";
import { GrupoMiembro } from "./GrupoMiembro";
import { sequelize } from "../config/database";

export interface SesionAttributes{
    idsesion:number,
    nombre:string,
    descripcion:string,
    fechasesion:Date,
    fechahoraregistrosesion?:Date,
    habilitado:boolean,
    idgruposmiembro:number
}
export type SesionCreationAttributes = Optional<
SesionAttributes,
|'idsesion'
|'descripcion'
|'fechahoraregistrosesion'
>

export class Sesion extends Model<SesionAttributes> implements SesionAttributes{
    idsesion!: number;
    nombre!: string;
    descripcion!: string;
    fechasesion!: Date;
    fechahoraregistrosesion?: Date;
    habilitado!:boolean;
    idgruposmiembro!: number;

}

Sesion.init({
    idsesion:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    nombre:{
        type:DataTypes.STRING(55),
        allowNull:false
    },
    descripcion:{

        type:DataTypes.STRING(100)
    },
    fechasesion:{
        type:DataTypes.DATE,
        allowNull:false
    },
    habilitado:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    idgruposmiembro:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:GrupoMiembro,
            key:'idgruposmiembro'
        }
    }

},{
    sequelize,
    modelName:'Sesion',
    tableName:'sesiones',
    createdAt:'fechahoraregistrosesion',
    updatedAt:false
}
)
