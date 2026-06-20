import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TicketService, Ticket } from '../ticket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-ticket',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './lista-ticket.html'
})
export class ListaTicket {

  filtroActual: string = 'todos'; 

  constructor(private miServicio: TicketService) {}

  //lista completa
  get listaTickets(): Ticket[] {
    return this.miServicio.listaTickets;
  }

  //lista personalisada usaurio seleccionada con boton #filter
  get ticketsMostrados(): Ticket[] {
    if (this.filtroActual === 'abiertos') {
      return this.listaTickets.filter(ticket => ticket.abierto === true);
    } else if (this.filtroActual === 'resueltos') {
      return this.listaTickets.filter(ticket => ticket.abierto === false);
    } else {
      return this.listaTickets; // Si es todos devolvemos la lista entera
    }
  }

  //id filtrados para armar resumen #map
  get resumenIds(): string {
    const listaDeIds = this.ticketsMostrados.map(ticket => ticket.id_ticket);

    if (listaDeIds.length > 0) {
      return listaDeIds.join(' - '); // para que se vea mas lindo con los numeros: 1 - 2 - 5
    } else {
      return 'Ninguno';
    }
  }

  //ejecutan los botones html para cambiar el filtro
  cambiarFiltro(nuevoFiltro: string) {
    this.filtroActual = nuevoFiltro;
  }

  resolverTicket(idBuscado: number) {
    this.miServicio.resolverTicket(idBuscado);
  }

  eliminarTicket(id_ticket_buscado: number) {
    this.miServicio.eliminarTicket(id_ticket_buscado);
  }


}