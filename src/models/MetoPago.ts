import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface MetodoPagoAtributes{
    idmetodosdepago: number,
    nombre: string,
    descripcion: string
}

export class MetodoPago extends Model<MetodoPagoAtributes> implements MetodoPagoAtributes{
    idmetodosdepago!: number;
    nombre!: string;
    descripcion!: string;
}


MetodoPago.init({
    idmetodosdepago:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING(150)
    }
},{
    sequelize,
    modelName:'MetodoPago',
    tableName:'metodosdepago',
    timestamps:false
})

