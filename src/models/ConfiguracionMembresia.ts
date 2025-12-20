import { Attributes, DataTypes, Model,  } from "sequelize";
import { sequelize } from "../config/database";

export interface ConfiguracionMembresiaAtributes {
    idconfiguracionmembresia?: number;
    descripcion: string;
    montoparamembresia: number;
    frecuenciamesesrenovacion: number;
    cantidaddediasparapagar: number;
    activo: boolean;
}

export class ConfiguracionMembrersia extends Model<ConfiguracionMembresiaAtributes> implements ConfiguracionMembresiaAtributes{
    idconfiguracionmembresia!:number;
    descripcion!: string;
    montoparamembresia!: number;
    frecuenciamesesrenovacion!: number;
    cantidaddediasparapagar!: number;
    activo!: boolean;
}

ConfiguracionMembrersia.init({
    idconfiguracionmembresia:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    montoparamembresia:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    frecuenciamesesrenovacion:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidaddediasparapagar:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activo:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    sequelize,
    modelName:'ConfiguracionMembrersia',
    tableName:'configuracionmembresias',
    timestamps: false    
});