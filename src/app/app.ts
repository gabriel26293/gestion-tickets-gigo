import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Ticket{
  id: number;
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
export class App {
  
  tituloSistema: string = 'Gigo - Gestion de Incidente';

  //lista por ahora vacia
  listaTicket: Ticket[] = [];

  //auxiliares
  nuevoSolicitante: string = '';
  nuevoEquipo: string = '';
  nuevaDescripcion: string = '';

  //valido datos vacios y los guardo
  crearTicket (){
    //valido datos vacios
    if (this.nuevoSolicitante == '' || this.nuevaDescripcion == ''){
      alert ("Por favor, complete al menos el solicitante y la descripcion.");
      return;  
    }

    const nuevoIncidente: Ticket = {

      id: this.listaTicket.length + 1,
      solicitante: this.nuevoSolicitante,
      equipoAsignado: this.nuevoEquipo,
      descripcion: this.nuevaDescripcion,
      abierto: true
    }

    //pusheo el ticket en la lista o sea en nuevo incidente
    this.listaTicket.push(nuevoIncidente);

    //limpio
    this.nuevoSolicitante='';
    this.nuevoEquipo='';
    this.nuevaDescripcion='';

  }


}
