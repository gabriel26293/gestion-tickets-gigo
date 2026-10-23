import { Pipe, PipeTransform, WritableSignal /*#DIR8 Agrego para usar WritableSignal */ } from '@angular/core';
import { Ticket } from '../ticket.model'; // #DIR6 Traemos el molde (las interfases)Mudado a ticket.model.ts a pedido del profe

@Pipe({
  name: 'filtroTickets',
  standalone: true
})
export class FiltroTicketsPipe implements PipeTransform {

  //#DIR7 Pedido del profe... La tuberia recibe la lista de tickets que ya paso por el filtro de seguridad (roles), 
  // y un texto que nos dice que boton apreto el usuario ('todos' 'abiertos' o 'resueltos')
  transform(ticketsSeguros: Ticket[], filtroElegido: string, contadorSignal?: WritableSignal<number>): Ticket[] {//#DIR8 como fallaba tuve que usar writesignal y agregar el parametro
    
    if (!ticketsSeguros) return [];

    let listaFiltrada = ticketsSeguros; //#DIR8 agrego la lista filtada para corregir el error

    if (filtroElegido === 'abiertos') {
      return ticketsSeguros.filter(ticket => ticket.abierto === true);
    } else if (filtroElegido === 'resueltos') {
      listaFiltrada = ticketsSeguros.filter(ticket => ticket.abierto === false);
    }
      /*#DIR8 codigo viejo lo reemplazamos con el codigo linea 20
    } else if (filtroElegido === 'resueltos') {
      return ticketsSeguros.filter(ticket => ticket.abierto === false);
    } else {
      return ticketsSeguros; // Si es 'todos', pasan derecho
    }*/
    // Actualizamos el Signal con la cantidad final (si es que nos pasaron el Signal)
    if (contadorSignal) {      
      setTimeout(() => contadorSignal.set(listaFiltrada.length));//#DIR8 Use setTimeout para evitar el error "ExpressionChangedAfterItHasBeenCheckedError"
    }
    return listaFiltrada;

  }
}