import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface UsuarioAttributes{
    codigousuario:string,
    nombres:string,
    correo?:string,
    contrasenia:string,
    rol:string,
    activo:boolean,
    fechacreacion?:Date
}

export class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes{
    public codigousuario!: string;
    public nombres!: string;
    public correo?: string;
    public contrasenia!: string;
    public rol!: string;
    public activo!: boolean;
    public fechacreacion?: Date;
}

Usuario.init({
    codigousuario:{
        type:DataTypes.STRING(10),
        allowNull:true,
        primaryKey:true
    },
    nombres:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    correo:{
        type:DataTypes.STRING(45),
    },
    contrasenia:{
        type:DataTypes.STRING(45),
        allowNull:false
    },
    rol:{
        type:DataTypes.STRING(45),
        allowNull:false
    },
    activo:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
},{
    sequelize,
    modelName:'Usuario',
    tableName:'usuarios',
    createdAt:'fechacreacion',
    updatedAt:false
})