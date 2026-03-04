import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { PagoMembresiasEstudiante } from "./PagoMembresiaMiembro";

export interface DetallePagoMembresiaAtributes {
    iddetalledepago?: number,
    idmembresia: number,
    idpagosmebresiasmiembro: number,
    descripcion_membresia: string,
    montomembresia: number,
    detalleadicional: string,
}

export type DetallePagoMembresiaCreationAttributes = Optional<
    DetallePagoMembresiaAtributes,
    | "iddetalledepago"
    | "detalleadicional"
>;
export class DetallePagoMembresia extends Model<DetallePagoMembresiaAtributes> implements DetallePagoMembresiaAtributes {
    iddetalledepago!: number;
    idmembresia!: number;
    idpagosmebresiasmiembro!: number;
    descripcion_membresia!: string;
    montomembresia!: number;
    detalleadicional!: string;
}

DetallePagoMembresia.init({
    iddetalledepago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idmembresia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PagoMembresiasEstudiante,
            key: 'idmembresia'
        },
        onDelete: 'NO ACTION'
    },
    idpagosmebresiasmiembro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PagoMembresiasEstudiante,
            key: 'idpagosmebresiasmiembro'
        },
        onDelete: 'NO ACTION'
    },
    descripcion_membresia: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    montomembresia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    detalleadicional: {
        type: DataTypes.STRING(100),
    }
}, {
    sequelize,
    modelName: 'DetallePagoMembresia',
    tableName: 'detalledepagos',
    timestamps: false
})