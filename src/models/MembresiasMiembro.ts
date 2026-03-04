import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Estudiante } from "./Estudiante";
import { ConfiguracionMembrersia } from "./ConfiguracionMembresia";


export interface MembresiasMiembroAtributes {
    idmembresia?: number,
    dni: string,
    descripcionmembresia: string,
    fechainicio: Date,
    fechalimitedepago: Date,
    fechavencimientosugerida: Date,
    montoesperado: number,
    montopagado?: number,
    estadopago?: string,
    idconfiguracionmembresia: number
}

export class MembresiasMiembro extends Model<MembresiasMiembroAtributes> implements MembresiasMiembroAtributes {
    public idmembresia?: number;
    public dni!: string;
    public descripcionmembresia!: string;
    public fechainicio!: Date;
    public fechalimitedepago!: Date;
    public fechavencimientosugerida!: Date;
    public montoesperado!: number;
    public montopagado?: number;
    public estadopago?: string;
    public idconfiguracionmembresia!: number;
}

MembresiasMiembro.init({
    idmembresia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
        references: {
            model: Estudiante,
            key: 'dni'
        },
        onDelete: 'NO ACTION'
    },
    descripcionmembresia: {
        type: DataTypes.STRING(55),
        allowNull: false,

    },
    fechainicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechalimitedepago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fechavencimientosugerida: {
        type: DataTypes.DATE,
        allowNull: false
    },
    montoesperado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    montopagado: {
        type: DataTypes.DECIMAL(10, 2)
    },
    idconfiguracionmembresia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ConfiguracionMembrersia,
            key: 'idconfiguracionmembresia'
        },
        onDelete: 'NO ACTION'
    }
}, {
    sequelize,
    modelName: 'MiembrosMembresia',
    tableName: 'membresiasmiembros',
    timestamps: false
});