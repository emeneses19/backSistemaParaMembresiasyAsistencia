export function convertirFechaString(fecha: Date | string): string {

    if (fecha instanceof Date) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia} 00:00:00`;
    }

    if (typeof fecha === 'string') {
        const fechaLimpia = fecha.includes('T') ? fecha.split('T')[0] : fecha;
        
        const partes = fechaLimpia.split(/[- /]/); // Divide por guion, espacio o diagonal
        if (partes.length >= 3) {
            const anio = partes[0];
            const mes = partes[1].padStart(2, '0');
            const dia = partes[2].trim().padStart(2, '0');
            
            return `${anio}-${mes}-${dia} 00:00:00`;
        }
    }

    // Caso de respaldo por si llega algo inesperado
    const fallbackDate = new Date(fecha);
    const anio = fallbackDate.getFullYear();
    const mes = String(fallbackDate.getMonth() + 1).padStart(2, '0');
    const dia = String(fallbackDate.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia} 00:00:00`;
}