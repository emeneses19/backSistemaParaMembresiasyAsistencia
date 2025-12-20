import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface AreaAttributes{
    idarea: number;
    nombrearea: string;
    descripcion:string;
}

export class Area extends Model<AreaAttributes> implements AreaAttributes{
    idarea!: number;
    nombrearea!: string;
    descripcion!: string;
}

Area.init({
    idarea:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull: false,
        autoIncrement: true
    },
    nombrearea:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING(60),
    }

},{
    sequelize,
    tableName:'areas',
    modelName: 'Area',
    timestamps: false

})