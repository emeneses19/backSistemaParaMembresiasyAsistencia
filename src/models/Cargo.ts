import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface CargoAtributes{
    idcargo: number;
    nombrecargo: string;
    descripcion: string;
}

export class Cargo extends Model<CargoAtributes> implements CargoAtributes{
    idcargo!: number;
    nombrecargo!: string;
    descripcion!: string;
}

Cargo.init({
    idcargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombrecargo:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING(60),
    }
},{
    sequelize,
    modelName:'Cargo',
    tableName: 'cargos',
    timestamps: false
})