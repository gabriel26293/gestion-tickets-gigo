//#DIR21 OJO usar este servicio solo para exportar. VER si se quiere usar para otra cosa
import { Injectable } from '@angular/core';
import { Ticket } from './ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ExportarCsvService {

  constructor() { }

  // #DIR21: Logica aislada para exportar la grilla a Excel/CSV
  descargarCSV(tickets: Ticket[], nombreArchivo: string) {
    let csv = 'ID,Solicitante,Titulo,Tipo,Asignacion,Categoria,Estado,Fecha\n';
    
    tickets.forEach(ticket => {
      const id = ticket.id_ticket;
      const solicitante = ticket.solicitante;
      
      let tituloLimpio = '';
      if (ticket.titulo) {
         tituloLimpio = ticket.titulo.replace(/,/g, ' '); 
      }
      
      const tipo = ticket.tipo;
      const asignacion = ticket.asignacion;
      const categoria = ticket.categoria;
      
      let estado = '';
      if (ticket.abierto) {
        estado = 'Abierto';
      } else {
        estado = 'Resuelto';
      }
      
      let fechaLimpia = '';
      if (ticket.fechaCreacion) {
        const fechaObj = new Date(ticket.fechaCreacion);
        fechaLimpia = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString();
      }

      const fila = id + ',' + solicitante + ',' + tituloLimpio + ',' + tipo + ',' + asignacion + ',' + categoria + ',' + estado + ',' + fechaLimpia;
      
      csv = csv + fila + '\n';
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' }); //manejo de utf
    const url = window.URL.createObjectURL(blob);
    
    const etiquetaA = document.createElement('a');
    etiquetaA.href = url;
    etiquetaA.download = nombreArchivo;
    etiquetaA.click();
    
    window.URL.revokeObjectURL(url);
  }
}