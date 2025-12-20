import { DataTypes, Model } from "sequelize";

import { sequelize } from "../config/database";
import { Estudiante } from "./Estudiante";
import { Curso } from "./Curso";

export interface InscripcionAtributes{
    idinscripcion:string,
    fechadeinscripcion:Date,
    estado: string,
    dni:string,
    idcurso:number
}

export class Inscripcion extends Model<InscripcionAtributes> implements InscripcionAtributes{
    idinscripcion!: string;
    fechadeinscripcion!: Date;
    estado!: string;
    dni!: string;
    idcurso!: number;
}

Inscripcion.init({
    idinscripcion:{
        type:DataTypes.STRING(45),
        allowNull:false,
        primaryKey: true
    },
    fechadeinscripcion:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    estado:{
        type:DataTypes.STRING(10),
        allowNull:false,
    },
    dni:{
       type:DataTypes.STRING(8),
       allowNull:false,
       references:{
        model:Estudiante,
        key:'dni'
       }
    },
    idcurso:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Curso,
            key:'idcurso'
        }
    }
},{
    sequelize,
    modelName:'Inscripcion',
    tableName:'inscripcion',
    timestamps: false
})