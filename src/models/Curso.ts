import { DataTypes, Model,  } from "sequelize";
import { sequelize } from "../config/database";
import { Periodo } from "./Periodo";

export interface CursoAtributes{
    idcurso: number;
    nombre: string;
    costo: number;
    idperiodo: number;
}

export class Curso extends Model<CursoAtributes> implements CursoAtributes{
    public idcurso!: number;
    public nombre!: string;
    public costo!: number;
    public idperiodo!: number;
}

Curso.init({
    idcurso:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    costo:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    idperiodo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Periodo,
            key:'idperiodo'
        }
    }
},{
    sequelize,
    modelName:'Curso',
    tableName:'cursos',
    timestamps:false

})