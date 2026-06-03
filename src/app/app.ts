import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Ticket{
  id_ticket: number;
  solicitante: string;
  descripcion: string;
  equipoAsignado: string;
  abierto: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { //clase principal
  
  tituloSistema: string = 'Gigo - Gestion de Incidente';

  //lista por ahora vacia
  listaTickets: Ticket[] = [];

  //auxiliares
  nuevoSolicitante: string = '';
  nuevoEquipo: string = '';
  nuevaDescripcion: string = '';

  //objeto crear > valido datos vacios y los guardo 
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



    //pusheo el ticket en la lista o sea en nuevo incidente
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
  }


}
