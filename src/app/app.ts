import { Component } from '@angular/core';

interface Ticket{
  id: number;
  solicitante: string;
  descripcion: string;
  equipoAsignado: string;
  abierto: boolean;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  tituloSistema: string = 'Gigo - Gestion de Incidente';

  listaTicket: Ticket[] = [];

}
