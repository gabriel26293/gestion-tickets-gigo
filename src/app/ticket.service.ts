import { Injectable } from '@angular/core';

export interface Ticket{
  id_ticket: number;
  solicitante: string;
  descripcion: string;
  equipoAsignado: string;
  abierto: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  listaTickets: Ticket[] = [
    /*{id_ticket: 1,
    solicitante: "Francisco Perez",
    descripcion: "Pc no enciende",
    equipoAsignado: "Notebook #123",
    abierto: true
    }*/
  ];

  //al mudar la creacion a service no puedo leer pantalla entonces paso datos por parametros

  contadorId: number = 1;
  agregarTicket(solicitanteIngresado: string, equipoIngresado: string, descripcionIngresada: string) {
    const nuevoIncidente: Ticket = {
      id_ticket: this.contadorId,
      solicitante: solicitanteIngresado,
      equipoAsignado: equipoIngresado,
      descripcion: descripcionIngresada,
      abierto: true 
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
