import { Component, OnInit } from '@angular/core'; //por ahora para administrar la pantalla de admin y user usamos oninit en lista-ticket linea 12
import { DatePipe } from '@angular/common';
import { TicketService } from '../ticket.service';
import { Ticket } from '../ticket.model';//#DIR6 Mudado a ticke.model.ts
import { RouterLink } from '@angular/router';
import { FiltroTicketsPipe } from '../pipes/filtro-tickets-pipe'; //#DIR7 pedido del profe nuevo pipe
import {  signal } from '@angular/core';//DIR8 Uso de signals (Parte C)
import { SlicePipe, UpperCasePipe} from '@angular/common'; //#DIR10 Hash Corto para mejorar la UX del usuario (sobre el id de ticket).. ya se que podiamos agregarlo arriba pero queria seguir un orden ;)
import { ExportarCsvService } from '../exportar-csv.service'; //#DIR21 solo para exportar csv

@Component({
  selector: 'app-lista-ticket',
  standalone: true,
  imports: [DatePipe, RouterLink, FiltroTicketsPipe, SlicePipe, UpperCasePipe, ],//#DIR7 forma parte del pedido FiltroTicketsPipe #DIR10 mejora UX usuario idticket SlicePipe UpperCasePipe
  templateUrl: './lista-ticket.html',
  styleUrl: './lista-ticket.css'
})
export class ListaTicket implements OnInit {

  filtroActual: string = 'todos';
  cantidadVisible = signal(0);//#DIR8 Uso de signals (Parte C)

  //para la seguridad
  usuarioLogueado: string = ''; //tambien sirve para mostrar correo apenas me logeo, ademas de cuando creo ticke //#DIR17 mejora para ver roll
  rolLogueado: string = '';//ambien sirve para mostrar correo/roll apenas me logeo, ademas de cuando creo ticke //#DIR17 mejora para ver roll

  constructor(private miServicio: TicketService, 
  private exportadorCsv: ExportarCsvService) // #DIR21 SUMO el servicio de exportacion
  {}

  ngOnInit() { //mi clase para ver el roll
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
    //return this.miServicio.listaTickets; #DIR14 remplazo por la siguiente linea, solo agregue parentesis
    return this.miServicio.listaTickets(); //#DIR14 reemplace la linea anterior para usar signal, ya que me rompia la vista de ticket apenas me logeaba
  }

  // seguridad roles. Basado en if / else para filtrar los tickets (todos, abiertos, resueltos) por ahora
  //Mas adelante en #DIR7 usamos friltro-tickets en pipes a pedido del profe entonces los filtros lo sacamos > (Linea #DIR71b)
  get ticketsMostrados(): Ticket[] { //ahora solo lo encargo de la seguridad, no importa si estan abiertos o cerrados, de eso lo encargo al HTML con el Pipe
        
    let listaPermitida = this.listaTickets;// filtro por rol de seguridad

    if (this.rolLogueado === 'user') {// (Si es admin pasamos de largo el if mantiene lista entera)
      listaPermitida = listaPermitida.filter(ticket => ticket.solicitante === this.usuarioLogueado);
    }    
    //this.cantidadVisible.set(listaPermitida.length);// #DIR8 seteamos al signal la cantidad de tickets que quedaron (pedido del profe)  
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

  /*#DIR9 CODIGO VIEJO ahora no es mas number, es string para migrar firestone
  resolverTicket(idBuscado: number) { 
  resolverTicket(idBuscado: string | undefined) {
    this.miServicio.resolverTicket(idBuscado);
  }*/
  resolverTicket(idBuscado: string | undefined) {
    if(idBuscado) this.miServicio.resolverTicket(idBuscado);
  }

  //#DIR24 MEJORA no quiero el boton en la pantalla principal ni dejarlo a lista tickets que decida, lo mudamos
  /*#DIR9 CODIGO VIEJO - eliminarTicket(id_ticket_buscado: number) { #DIR9 idem linea 90 metodo resolverTicket
  eliminarTicket(id_ticket_buscado: string | undefined) {
    this.miServicio.eliminarTicket(id_ticket_buscado);
  }*/
  //eliminarTicket(id_ticket_buscado: string | undefined) {
  //  if(id_ticket_buscado) this.miServicio.eliminarTicket(id_ticket_buscado);
  //}
  
  exportarCSV() {// #DIR21 Disparo la descarga del cvs delegando al servicio
    this.exportadorCsv.descargarCSV(this.ticketsMostrados, 'Gigo_Incidentes.csv');
  }

}