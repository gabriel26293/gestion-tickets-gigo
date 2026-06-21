import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
//import { FormsModule } from '@angular/forms';
//import { TicketService, Ticket } from './ticket.service';
//import { DatePipe } from '@angular/common';

//mudado#1 a service
/*
interface Ticket{
  id_ticket: number;
  solicitante: string;
  descripcion: string;
  equipoAsignado: string;
  abierto: boolean;
}*/

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink], //importamos herramientas de navegacion
  //imports: [FormsModule, DatePipe], #Ver despues eliminar
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { //clase principal
  
  constructor(public enrutador: Router) {} //por ahora el enrutador lo dejamos public

    cerrarSesion() {
    localStorage.removeItem('sesion_usuario'); //borramos credenciales
    this.enrutador.navigate(['/login']); //mandamos al login
  }

  //tituloSistema: string = 'Gigo - Gestion de Incidente'; >> mudado en rutas

  /*#mudado2 a service lista por ahora vacia
  listaTickets: Ticket[] = []; #mudado2 */

/*hasta linea 43
  //auxiliares
  nuevoSolicitante: string = '';
  nuevoEquipo: string = '';
  nuevaDescripcion: string = '';
  
  //uso el constructor de mi clase para aplicar la inyeccion de dependencia > Parte de la mudanza a service
  constructor(private miServicio: TicketService) {} //encapsulo

  //otra parte de la mudanza > uso el metodo getter para que el html pueda leer mi lista
  get listaTickets(): Ticket[] {
    return this.miServicio.listaTickets;
  }
  */
  //Parte de la mudanza: objeto crear > valido datos vacios y los guardo 
  /*hastas linea 88
    crearTicket (){
    //valido datos vacios
    if (this.nuevoSolicitante == '' || this.nuevaDescripcion == ''){
      alert ("Por favor, complete al menos el solicitante y la descripcion.");
      return;  
    }
    //Tengo ver si mas adelante le meto otra valadacion

    //mi objeto para crear
    const nuevoIncidente: Ticket = {

      id_ticket: this.listaTickets.length + 1,
      solicitante: this.nuevoSolicitante,
      equipoAsignado: this.nuevoEquipo,
      descripcion: this.nuevaDescripcion,
      abierto: true
    }

    //pusheo el ticket en la lista (creo incidente y lo mando)
    this.listaTickets.push(nuevoIncidente);

    //limpio
    this.nuevoSolicitante='';
    this.nuevoEquipo='';
    this.nuevaDescripcion='';

  }

  //mi otro objeto resolver
  resolverTicket (idBuscado: number) {
    //uso find pero equivale a select *from where id_ticket = x si uso bd
    const ticketEncontrado = this.listaTickets.find (ticket => ticket.id_ticket === idBuscado); //SELECT * FROM listaTickets WHERE id_ticket = @idBuscado

      if(ticketEncontrado){
        ticketEncontrado.abierto =false;
      }
  }

  //metodo para "eliminar" con filter, ver si lo dejamos
  eliminarTicket(id_ticket_buscado: number){
    this.listaTickets = this.listaTickets.filter(ticket => ticket.id_ticket !== id_ticket_buscado);
  }*/

/*hasta linea 117
  //parte de la mudanza hace esto: que la pantalla solo avisa y el servicio trabaja
  crearTicket() {
    if (this.nuevoSolicitante == '' || this.nuevaDescripcion == '') {
      alert ("Por favor, complete los datos del solicitante y la descripcion.");
      return;  
    }
  
      this.miServicio.agregarTicket(
      this.nuevoSolicitante, 
      this.nuevoEquipo, 
      this.nuevaDescripcion
    );
   
    this.nuevoSolicitante = '';
    this.nuevoEquipo = '';
    this.nuevaDescripcion = '';
  }


  //resolverTicket y eiliminar Ticket lo mude a service.
  resolverTicket(idBuscado: number) {
    this.miServicio.resolverTicket(idBuscado);
  }

  eliminarTicket(id_ticket_buscado: number) {
    this.miServicio.eliminarTicket(id_ticket_buscado);
  }

*/
}
