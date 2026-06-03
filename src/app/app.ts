import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket } from './ticket.service';

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
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { //clase principal
  
  tituloSistema: string = 'Gigo - Gestion de Incidente';

  /*#mudado2 a service lista por ahora vacia
  listaTickets: Ticket[] = []; #mudado2 */

  //auxiliares
  nuevoSolicitante: string = '';
  nuevoEquipo: string = '';
  nuevaDescripcion: string = '';

  //uso el constructor de mi clase para aplicar la inyeccion de dependencia > Parte de la mudanza a service
  constructor(private miServicio: TicketService) {}

  //otra parte de la mudanza > uso el getter para que el html pueda leer mi lista
  get listaTickets(): Ticket[] {
    return this.miServicio.listaTickets;
  }

  //objeto crear > valido datos vacios y los guardo 
  /*crearTicket (){
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

  //parte de la mudanza hace esto: que la pantalla solo avisa y el servicio trabaja
  crearTicket() {
    if (this.nuevoSolicitante == '' || this.nuevaDescripcion == '') {
      alert ("Por favor, complete al menos el solicitante y la descripcion.");
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


}
