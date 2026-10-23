import { Component, OnInit } from '@angular/core'; //por ahora para administrar la pantalla de admin y user usamos oninit en lista-ticket linea 12
import { DatePipe } from '@angular/common';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';//#DIR6 Mudado a ticke.model.ts
import { RouterLink } from '@angular/router';
import { FiltroTicketsPipe } from '../pipes/filtro-tickets-pipe'; //#DIR7 pedido del profe nuevo pipe

@Component({
  selector: 'app-lista-ticket',
  standalone: true,
  imports: [DatePipe, RouterLink, FiltroTicketsPipe],//#DIR7 forma parte del pedido
  templateUrl: './lista-ticket.html'
})
export class ListaTicket implements OnInit {

  filtroActual: string = 'todos'; 

  //para la seguridad
  usuarioLogueado: string = '';
  rolLogueado: string = '';

  constructor(private miServicio: TicketService) {}

  ngOnInit() {
    // al abrir grilla vemos el rol del que esta mirando
    const sesion = localStorage.getItem('sesion_usuario');
    if (sesion !== null) {
      const datosUsuario = JSON.parse(sesion);
      this.usuarioLogueado = datosUsuario.username;
      this.rolLogueado = datosUsuario.role;
    }
  }

  //lista completa
  get listaTickets(): Ticket[] {
    return this.miServicio.listaTickets;
  }

  // seguridad roles. Basado en if / else para filtrar los tickets (todos, abiertos, resueltos) por ahora
  //Mas adelante en #DIR7 usamos friltro-tickets en pipes a pedido del profe entonces los filtros lo sacamos > (Linea #DIR71b)
  get ticketsMostrados(): Ticket[] { //ahora solo lo encargo de la seguridad, no importa si estan abiertos o cerrados, de eso lo encargo al HTML con el Pipe
        
    let listaPermitida = this.listaTickets;// filtro por rol de seguridad

    if (this.rolLogueado === 'user') {// (Si es admin pasamos de largo el if mantiene lista entera)
      listaPermitida = listaPermitida.filter(ticket => ticket.solicitante === this.usuarioLogueado);
    }    
    /*#DIR71b codigo viejo
    //  filtro botones (Abierto/Cerrado) sobre la lista ya asegurada
    if (this.filtroActual === 'abiertos') {
      return listaPermitida.filter(ticket => ticket.abierto === true);
    } else if (this.filtroActual === 'resueltos') {
      return listaPermitida.filter(ticket => ticket.abierto === false);
    } else { */
      return listaPermitida; 
    //}
  }

/*
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
*/
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