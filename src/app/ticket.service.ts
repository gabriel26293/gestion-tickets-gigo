import { Injectable } from '@angular/core';

export interface Ticket{
  id_ticket: number;
  solicitante: string;
  descripcion: string;
  equipoAsignado: string;
  abierto: boolean;
  fechaCreacion: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  listaTickets: Ticket[] = [
    {
    id_ticket: 1,
    solicitante: "Francisco Perez",
    descripcion: "Pc no enciende",
    equipoAsignado: "Notebook #123",
    abierto: true,
    fechaCreacion: new Date ('2026-06-04T18:35:25'),
    }
  ];
  
  contadorId: number;

  // usamos el constructor para darle el valor inicial usando if/else y controlar los id de la lista
  constructor() {    
     if (this.listaTickets.length > 0) {
      
      const todosLosIds = this.listaTickets.map(ticket => ticket.id_ticket);      
      
      const idMasAlto = Math.max(...todosLosIds);      
      
      this.contadorId = idMasAlto + 1;
      
    } else {      
       this.contadorId = 1;      
      }
  }

  //al mudar la creacion a service no puedo leer pantalla entonces paso datos por parametros  
  agregarTicket(solicitanteIngresado: string, equipoIngresado: string, descripcionIngresada: string) {
    const nuevoIncidente: Ticket = {
      id_ticket: this.contadorId,
      solicitante: solicitanteIngresado,
      equipoAsignado: equipoIngresado,
      descripcion: descripcionIngresada,
      abierto: true,
      fechaCreacion: new Date(),
    };
    
    this.listaTickets.push(nuevoIncidente);
    this.contadorId++;
  }

  resolverTicket(idBuscado: number) {
    const ticketEncontrado = this.listaTickets.find(ticket => ticket.id_ticket === idBuscado);
    if (ticketEncontrado) {
      ticketEncontrado.abierto = false;
    }
  }

  eliminarTicket(id_ticket_buscado: number) {
    this.listaTickets = this.listaTickets.filter(ticket => ticket.id_ticket !== id_ticket_buscado);
  }
  
}
