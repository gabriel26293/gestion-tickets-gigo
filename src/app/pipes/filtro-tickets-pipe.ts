import { Pipe, PipeTransform, WritableSignal /*#DIR8 Agrego para usar WritableSignal */ } from '@angular/core';
import { Ticket } from '../ticket.model'; // #DIR6 Traemos el molde (las interfases)Mudado a ticket.model.ts a pedido del profe

@Pipe({
  name: 'filtroTickets',
  standalone: true,
  pure: false // #DIR28 Obligamos al pipe a escuchar cada tecla en tiempo real
})
export class FiltroTicketsPipe implements PipeTransform {

  //#DIR7 Pedido del profe... La tuberia recibe la lista de tickets que ya paso por el filtro de seguridad (roles), 
  // y un texto que nos dice que boton apreto el usuario ('todos' 'abiertos' o 'resueltos')
  //#DIR28 Agregamos criterioBusqueda y textoBusqueda como parametros opcionales esta mejora la linkeo en lista-ticket.html
  transform(ticketsSeguros: Ticket[], filtroElegido: string, contadorSignal?: WritableSignal<number>, criterioBusqueda?: string, textoBusqueda?: string): Ticket[] {
    
    if (!ticketsSeguros) return [];

    let listaFiltrada = ticketsSeguros; 

    // filtro por estado (abierto / resuelto)
    if (filtroElegido === 'abiertos') {
      listaFiltrada = listaFiltrada.filter(ticket => ticket.abierto === true);
    } else if (filtroElegido === 'resueltos') {
      listaFiltrada = listaFiltrada.filter(ticket => ticket.abierto === false);
    }
      
    // #DIR28 Filtro Dinamico Blindado (evita colapsos por tickets mal guardados)
    if (criterioBusqueda && textoBusqueda && textoBusqueda.trim() !== '') {
      const textoMinuscula = textoBusqueda.toLowerCase().trim();
      
      listaFiltrada = listaFiltrada.filter(ticket => {
        let valorAComparar = '';
        
        // Usamos || '' para evitar que un campo vacio rompa el codigo
        if (criterioBusqueda === 'id_ticket') {
          valorAComparar = ticket.id_ticket || '';
        } else if (criterioBusqueda === 'solicitante') {
          valorAComparar = ticket.solicitante || '';
        } else if (criterioBusqueda === 'tipo') {
          valorAComparar = ticket.tipo || '';
        } else if (criterioBusqueda === 'asignacion') {
          valorAComparar = ticket.asignacion || '';
        } else if (criterioBusqueda === 'categoria') {
          valorAComparar = ticket.categoria || '';
        }

        // Si el ticket contiene el texto (pasado a minuscula) lo mostramos
        if (valorAComparar.toLowerCase().includes(textoMinuscula)) {
          return true;
        } else {
          return false;
        }
      });
    }

    // actualizamos el signal con la cantidad final
    if (contadorSignal) {      
      setTimeout(() => contadorSignal.set(listaFiltrada.length));
    }
    
    return listaFiltrada;
  }



  /*#DIR28 REMPLAZO CODIGO VIEJO el motodo por otro nuevo
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
    /*if (contadorSignal) {      
      setTimeout(() => contadorSignal.set(listaFiltrada.length));//#DIR8 Use setTimeout para evitar el error "ExpressionChangedAfterItHasBeenCheckedError"
    }
    return listaFiltrada;

  }*/


}