import {  Optional, Model, DataTypes } from "sequelize"; 
import { sequelize } from "../config/database";

export interface PeriodoAtributes{
    idperiodo: number,
    nombreperiodo: string
}

export class Periodo extends Model<PeriodoAtributes> implements PeriodoAtributes{
    public idperiodo!: number;
    public nombreperiodo!: string;
}
Periodo.init({
    idperiodo:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
        
    },
    nombreperiodo:{
        type:DataTypes.STRING(45),
        allowNull: false
    }
},{
    sequelize,
    modelName:'Periodo',
    tableName:'periodos',
    timestamps: false
})