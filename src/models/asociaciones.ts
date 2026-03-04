
import { Area } from "./Area";
import { AsistenciasMiembro } from "./AsistenciasMiembro";
import { Cargo } from "./Cargo";
import { ConfiguracionMembrersia } from "./ConfiguracionMembresia";
import { Curso } from "./Curso";
import { DetallePagoMembresia } from "./DetallePagoMembresia";
import { Estudiante } from "./Estudiante";
import { GrupoMiembro } from "./GrupoMiembro";
import { Inscripcion } from "./Inscripcion";
import { MembresiasMiembro } from "./MembresiasMiembro";
import { MetodoPago } from "./MetoPago";
import { PagoCurso } from "./PagoCurso";
import { PagoMembresiasEstudiante } from "./PagoMembresiaMiembro";
import { Periodo } from "./Periodo";
import { Sesion } from "./Sesion";

//para Cursos
Periodo.hasMany(Curso, {
    foreignKey: 'idperiodo'
})
Curso.belongsTo(Periodo, {
    foreignKey: 'idperiodo',
    onDelete: 'NO ACTION'
})

// estudiantes 
GrupoMiembro.hasMany(Estudiante, {
    foreignKey: 'idgruposmiembro'
})

Estudiante.belongsTo(GrupoMiembro, {
    foreignKey: {
        name: 'idgruposmiembro',
        allowNull: true
    },
    as: 'GrupoDeMiembro',
    onDelete: 'NO ACTION'

})
Cargo.hasMany(Estudiante, {
    foreignKey: 'idcargo'
})
Estudiante.belongsTo(Cargo, {
    foreignKey: {
        name: 'idcargo',
        allowNull: true,
    },
    onDelete: 'NO ACTION'
})
Area.hasMany(Estudiante, {
    foreignKey: 'idarea'
})
Estudiante.belongsTo(Area, {
    foreignKey: {
        name: 'idarea',
        allowNull: true
    },
    onDelete: 'NO ACTION'
})

//para inscripcion tabla intermedia
Estudiante.belongsToMany(Curso, {
    through: Inscripcion,
    foreignKey: 'dni'
});
Inscripcion.belongsTo(Estudiante, {
    foreignKey: 'dni',
    onDelete: 'NO ACTION'
})

Curso.belongsToMany(Estudiante, {
    through: Inscripcion,
    foreignKey: 'idcurso'
})

Inscripcion.belongsTo(Curso, {
    foreignKey: 'idcurso',
    onDelete: 'NO ACTION'
})

//para pagos de cursos
Inscripcion.hasMany(PagoCurso, {
    foreignKey: 'idinscripcion'
});
PagoCurso.belongsTo(Inscripcion, {
    foreignKey: 'idinscripcion',
    onDelete: 'NO ACTION'
})

MetodoPago.hasMany(PagoCurso, {
    foreignKey: 'idmetodosdepago'
});
PagoCurso.belongsTo(MetodoPago, {
    foreignKey: 'idmetodosdepago',
    onDelete: 'NO ACTION'
})

//para membresias miembros
Estudiante.hasMany(MembresiasMiembro, {
    foreignKey: 'dni'
})
MembresiasMiembro.belongsTo(Estudiante, {
    foreignKey: 'dni',
    onDelete: 'NO ACTION'
})
ConfiguracionMembrersia.hasMany(MembresiasMiembro, {
    foreignKey: 'idconfiguracionmembresia',
});
MembresiasMiembro.belongsTo(ConfiguracionMembrersia, {
    foreignKey: 'idconfiguracionmembresia',
    onDelete: 'NO ACTION'
});

// para pagos membresias
MetodoPago.hasMany(PagoMembresiasEstudiante, {
    foreignKey: 'idmetodosdepago'
})
PagoMembresiasEstudiante.belongsTo(MetodoPago, {
    foreignKey: 'idmetodosdepago',
    onDelete: 'NO ACTION'

})

//para pagos y membresias y miembrso
MembresiasMiembro.belongsToMany(PagoMembresiasEstudiante, {
    through: DetallePagoMembresia,
    foreignKey: 'idmembresia'
});
DetallePagoMembresia.belongsTo(MembresiasMiembro, {
    foreignKey: 'idmembresia',
    as: 'Membresia',
    onDelete: 'NO ACTION'
});

PagoMembresiasEstudiante.belongsToMany(MembresiasMiembro, {
    through: DetallePagoMembresia,
    foreignKey: 'idpagosmebresiasmiembro'
});
DetallePagoMembresia.belongsTo(PagoMembresiasEstudiante, {
    foreignKey: 'idpagosmebresiasmiembro',
    onDelete: 'NO ACTION'
})

//para sesion y asistencias 

Sesion.hasMany(AsistenciasMiembro, {
    foreignKey: 'idsesion'
})

AsistenciasMiembro.belongsTo(Sesion, {
    foreignKey: 'idsesion',
    onDelete: 'NO ACTION'
})



