import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '../ticket.model'; // Traemos el molde

@Pipe({
  name: 'filtroTickets',
  standalone: true
})
export class FiltroTicketsPipe implements PipeTransform {

  //#DIR7 Pedido del profe... La tuberia recibe la lista de tickets que ya paso por el filtro de seguridad (roles), 
  // y un texto que nos dice que boton apreto el usuario ('todos' 'abiertos' o 'resueltos')
  transform(ticketsSeguros: Ticket[], filtroElegido: string): Ticket[] {
    
    if (!ticketsSeguros) return [];

    if (filtroElegido === 'abiertos') {
      return ticketsSeguros.filter(ticket => ticket.abierto === true);
    } else if (filtroElegido === 'resueltos') {
      return ticketsSeguros.filter(ticket => ticket.abierto === false);
    } else {
      return ticketsSeguros; // Si es 'todos', pasan derecho
    }
  }

}