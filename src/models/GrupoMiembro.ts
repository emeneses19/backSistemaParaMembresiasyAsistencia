import { DataTypes, Model   } from "sequelize";
import { sequelize } from "../config/database";

export interface GrupoMiembroAtributes {
    idgruposmiembro: number;
    nombredelgrupo:string;
    fechacreacion: Date;
}

export class GrupoMiembro extends Model<GrupoMiembroAtributes> implements GrupoMiembroAtributes{
    idgruposmiembro!: number;
    nombredelgrupo!: string;
    fechacreacion!: Date;
}

GrupoMiembro.init({
    idgruposmiembro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nombredelgrupo:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    fechacreacion:{
        type: DataTypes.DATE,
        allowNull: false
    }

},{
    sequelize,
    modelName:'GrupoMiembro',
    tableName:'gruposmiembros',
    timestamps: false
})
