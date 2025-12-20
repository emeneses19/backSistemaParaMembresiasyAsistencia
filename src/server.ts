import app from './app';
import { sequelize } from './config/database';
import cron from 'node-cron';
import { insertarMembresiasDeMiembrosTarea } from './jobs/insertarMembresiasJob';

const PORT = 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida.');
    
    //sincroniza modelos mientras estas en desarrollo
    await sequelize.sync({alter:true});
    console.log("Tablas sincronizadas");
     // Se ejecuta todos los días a las 00:00 (medianoche)
    cron.schedule('0 0 * * *', () => {
        insertarMembresiasDeMiembrosTarea();
    });
    console.log('Tarea de inserción de membresías programada.');


    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

main();